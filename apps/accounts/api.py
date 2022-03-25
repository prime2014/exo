from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import APIView
from apps.accounts.auth import Authentication
from django.contrib.auth import get_user_model, login
from rest_framework.response import Response
from apps.accounts.serializers import (
    LoginSerializer,
    UserSerializer,
    RelationshipSerializer
)
from rest_framework import status,permissions
from apps.accounts.utils import activation_token
from apps.accounts.tasks import send_activation_link
from apps.accounts.models import (
    Relationship,
)
from rest_framework import authentication, permissions, status

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
            login(request, user)
            return Response({'token': user.auth_token.key, 'user': UserSerializer(user).data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid User Credentials!'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewset(ModelViewSet):
    queryset = User.objects.all()
    authentication_classes = ()
    permission_classes = (permissions.AllowAny, )
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            token = activation_token.make_token(serializer.data)
            send_activation_link.delay(token, serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RelationshipViewset(ModelViewSet):
    queryset = Relationship.objects.all()
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
