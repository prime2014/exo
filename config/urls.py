from django.contrib import admin
from django.urls import path,include, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings
# from drf_yasg.views import get_schema_view
# from rest_framework import permissions
# from drf_yasg import openapi



# schema_view = get_schema_view(
#     openapi.Info(
#         title="Exo API",
#         default_version='v1',
#         description="This is the first version of exo openapi",
#         terms_of_service="https://www.google.com/policies/terms/",
#         contact=openapi.Contact(email="omondiprime@mail.com"),
#         license=openapi.License(name="BSD License"),
#     ),
#     public=True,
#     permission_classes=[permissions.AllowAny, ]
# )


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/rest/auth/", include("rest_framework.urls")),
    path('accounts/', include('apps.accounts.urls')),
    path("feeds/", include("apps.feeds.urls")),
    path("notifications/", include("notifications_rest.urls"))
]+staticfiles_urlpatterns()


urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls))
    ]+urlpatterns
