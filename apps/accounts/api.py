from codecs import lookup
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import APIView
from apps.accounts.auth import Authentication
from django.contrib.auth import get_user_model, login
from rest_framework.response import Response
from apps.accounts.serializers import (
    LoginSerializer,
    UserSerializer,
    RelationshipSerializer,
    ProfileImageSerializer
)
from rest_framework import status,permissions
from apps.accounts.utils import activation_token
from apps.accounts.tasks import send_activation_link
from apps.accounts.models import (
    Relationship,
    ProfileImages
)
from rest_framework import authentication, permissions, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from django.views.decorators.vary import vary_on_headers
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from notifications.signals import notify
from django_filters.rest_framework import DjangoFilterBackend
from apps.accounts.filters import FriendFilter

User = get_user_model()

authenticate = Authentication()


class LoginAPIView(APIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = LoginSerializer

    def post(self,request,**kwargs):
        email = request.data.get("email")
        password= request.data.get("password")
        try:
            user = authenticate.authenticate(request, username=email, password=password)
            if user: login(request, user)
            else: raise User.DoesNotExist
            return Response({'token': user.auth_token.key, 'user': UserSerializer(user, context={"request": request}).data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid User Credentials!'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewset(ModelViewSet):
    queryset = User.objects.all()
    authentication_classes = (authentication.SessionAuthentication, authentication.TokenAuthentication)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = UserSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'first_name', 'last_name']
    filterset_class = FriendFilter

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            token = activation_token.make_token(serializer.data)
            send_activation_link.delay(token, serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_object(), data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"Error": "There was an error updating the data"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['GET', 'PATCH'], detail=True)
    def activate_account(self, request, *args, **kwargs):
        user = self.get_object()
        serialized = self.serializer_class(instance=user)
        if request.method == "PATCH":
            token = request.data.get("token")

            if token and activation_token.check_token(serialized.data, token=token):
                user.is_active = True
                user.save(update_fields=['is_active'])
            else:
                return Response({"error": "Invalid token! Cannot activate user account"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


class ProfileImagesViewset(ModelViewSet):
    queryset = ProfileImages.objects.all()
    authentication_classes = (authentication.SessionAuthentication, )
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = ProfileImageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RelationshipViewset(ModelViewSet):
    queryset = Relationship.objects.all().select_related("from_person", "to_person")
    authentication_classes = (authentication.SessionAuthentication, )
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = RelationshipSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
