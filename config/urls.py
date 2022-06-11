from django.contrib import admin
from django.urls import path,include, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/rest/auth/", include("rest_framework.urls")),
    path('accounts/', include('apps.accounts.urls')),
    path("feeds/", include("apps.feeds.urls")),
    path("search/", include("haystack.urls")),
    path("notifications/", include("notifications_rest.urls"))
]+staticfiles_urlpatterns()


urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls))
    ]+urlpatterns
