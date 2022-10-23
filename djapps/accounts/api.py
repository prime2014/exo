from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import APIView
from djapps.accounts.auth import Authentication
from django.contrib.auth import get_user_model, login
from rest_framework.response import Response
from djapps.accounts.serializers import (
    LoginSerializer,
    UserSerializer,
    RelationshipSerializer,
    ProfileImageSerializer,
    LoggedInUser
)
from rest_framework import status, permissions
from djapps.accounts.utils import activation_token
from djapps.accounts.tasks import send_activation_link
from djapps.accounts.models import (
    Relationship,
    ProfileImages
)
from rest_framework import authentication
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from djapps.accounts.filters import FriendFilter
from djapps.accounts.reconstruct_on_redis import rconn_user
import logging
from djapps.accounts.tasks import send_json_user_document
from django.contrib.auth import logout
from notifications.signals import notify
from django.db.models import Q, Count
from rest_framework.parsers import MultiPartParser, FormParser


User = get_user_model()

authenticate = Authentication()


logging.basicConfig(format="%(asctime)s %(levelname)s %(message)s", encoding="utf8", level=logging.INFO)

logger = logging.getLogger(__name__)


class LoginAPIView(APIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = LoginSerializer

    def post(self, request, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            user = authenticate.authenticate(request, username=email, password=password)
            if user:
                login(request, user)
            else:
                raise User.DoesNotExist
            return Response({'token': user.auth_token.key, 'user': LoggedInUser(user,
                            context={"request": request}).data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid User Credentials!'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, **kwargs):
        logout(request)
        return Response({"success": "You have been successfully logged out"}, status=status.HTTP_200_OK)


class SuggestionsRequest(ModelViewSet):
    queryset = User.objects.annotate(friends=Count("relation"))
    authentication_classes = (authentication.SessionAuthentication, authentication.TokenAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'first_name', 'last_name']
    filterset_class = FriendFilter

    @action(methods=["GET"], detail=True)
    def suggestions(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        usrs = user.relation.filter(to_user__status="Friends")[:10]
        logger.info("LIST OF USRS: %s" % usrs)
        users = User.objects.filter(~Q(id__in=[user.id for user in list([*usrs, user])]))
        serializers = LoggedInUser(instance=users, many=True, context={"request": request})
        try:
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewset(ModelViewSet):
    queryset = User.objects.annotate(friends=Count("relation"))
    authentication_classes = (authentication.SessionAuthentication, authentication.TokenAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'first_name', 'last_name']
    filterset_class = FriendFilter

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):

        serializer = LoggedInUser(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            token = activation_token.make_token(serializer.data)
            send_activation_link.delay(token, serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):

        user = self.get_object()
        u = self.serializer_class(instance=user, context={"request": request}).data
        return Response(u, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_object(),
                                           data=request.data,
                                           partial=True,
                                           context={"request": request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"Error": "There was an error updating the data"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["PUT", "GET", "PATCH"], detail=True)
    def request_friend(self, request, *args, **kwargs):
        if request.method == "GET":
            user = self.get_object()
            return Response(self.serializer_class(instance=user, context={"request": request}).data,
                            status=status.HTTP_200_OK)
        elif request.method == "PUT":
            serializer = self.serializer_class(instance=self.get_object(),
                                               data=request.data,
                                               partial=True,
                                               context={"request": request})
            request_user = User.objects.filter(id=request.user.id).annotate(friends=Count("relation"))[0]
            requester = self.serializer_class(instance=request_user, context={"request": request})

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                notify.send(sender=request.user,
                            recipient=self.get_object(),
                            verb="Friend Request",
                            level="info",
                            description=f"You have a friend request notification from \
                                {request.user.first_name} {request.user.last_name}",
                            user=requester.data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == "PATCH":
            serializer = self.serializer_class(instance=self.get_object(),
                                               data=request.data,
                                               partial=True,
                                               context={"request": request})
            request_user = User.objects.filter(id=request.user.id).annotate(friends=Count("relation"))[0]
            requester = self.serializer_class(instance=request_user, context={"request": request})

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["GET"], detail=True)
    def get_friend(self, request, *args, **kwargs):
        qs = self.get_object().relation.filter(
            to_user__to_person=request.user,
            to_user__status="Friends"
        )
        if qs.exists():
            return Response({"friend": True}, status=status.HTTP_200_OK)
        else:
            return Response({"friend": False}, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=True)
    def suggestions(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        usrs = user.relation.filter(to_user__status="Friends")[:10]
        logger.info("LIST OF USRS: %s" % usrs)
        users = User.objects.filter(~Q(id__in=[user.id for user in list([*usrs, user])]))
        serializers = LoggedInUser(instance=users, many=True, context={"request": request})
        try:
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["PUT", "GET"], detail=True, serializer_class=RelationshipSerializer)
    def unfriend(self, request, *args, **kwargs):
        if request.method == "GET":
            relationship = Relationship.objects.filter(Q(from_person__id=request.user.id, status="Friends") |
                                                       Q(to_person__id=request.user.id, status="Friends"))
            serializers = self.serializer_class(instance=relationship, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)
        if request.method == "PUT":
            from_person = request.data.get("from_person")
            to_person = request.data.get("to_person")

            relationship = Relationship.objects.filter(from_person__id__in=[from_person, to_person],
                                                       to_person__id__in=[from_person, to_person])
            relationship.delete()
            return Response({"detail": "No data!"}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        pk = request.user.id
        rconn_user.delete_user(pk)
        self.get_object().delete()
        return Response({"detail": "No Content"}, status=status.HTTP_204_NO_CONTENT)


class UserAuthViewset(ModelViewSet):
    queryset = User.objects.annotate(friends=Count("relation"))
    authentication_classes = ()
    permission_classes = ()
    serializer_class = UserSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'first_name', 'last_name']
    filterset_class = FriendFilter

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):

        serializer = LoggedInUser(data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            token = activation_token.make_token(serializer.data)
            send_activation_link.delay(token, serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):

        user = self.get_object()

        u = self.serializer_class(instance=user, context={"request": request}).data

        return Response(u, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_object(),
                                           data=request.data,
                                           partial=True,
                                           context={"request": request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"Error": "There was an error updating the data"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['GET', 'PATCH'], detail=True)
    def activate_account(self, request, *args, **kwargs):
        user = self.get_object()
        serialized = self.serializer_class(instance=user, context={"request": request})
        if request.method == "PATCH":
            token = request.data.get("token")

            if token and activation_token.check_token(serialized.data, token=token):
                user.is_active = True
                user.save(update_fields=['is_active'])
                active_user = self.serializer_class(instance=user, context={"request": request}).data
                active_user.pop("meta")
                user = rconn_user.create_user(active_user)
                send_json_user_document.delay(user)
                return Response(active_user, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid token! Cannot activate user account"},
                                status=status.HTTP_400_BAD_REQUEST)
        return Response(UserSerializer(user, context={"request": request}).data, status=status.HTTP_200_OK)


class ProfileImagesViewset(ModelViewSet):
    queryset = ProfileImages.objects.all()
    authentication_classes = (authentication.SessionAuthentication, authentication.TokenAuthentication)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = ProfileImageSerializer
    parser_classes = (FormParser, MultiPartParser)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            my_image = serializer.data.get("image")
            medium_img = my_image.get("full_size")
            request.user.avatar = medium_img
            request.user.save(update_fields=["avatar"])

            return Response({"avatar": request.user.avatar}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RelationshipViewset(ModelViewSet):
    queryset = Relationship.objects.all().select_related("from_person", "to_person")
    authentication_classes = (authentication.SessionAuthentication, authentication.TokenAuthentication)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = RelationshipSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            my_meta = request.user.meta
            req = my_meta.get("requests")
            req.remove(int(request.data.get("to_person")))
            my_meta.update({"requests": req})

            request.user.meta = my_meta
            request.user.save(update_fields=["meta"])
            recipient = User.objects.filter(id=request.data.get("to_person")).annotate(friends=Count("relation"))[0]
            user = User.objects.filter(id=request.user.id).annotate(friends=Count("relation"))[0]

            requester = UserSerializer(instance=user, context={"request": request})
            notify.send(sender=user, recipient=recipient,
                        verb="Friend Request Accepted", level="success",
                        description=f"{request.user.first_name} {request.user.last_name} \
                            has accepted your friend request",
                        user=requester.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
