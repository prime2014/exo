from django.contrib import admin
from django.urls import path,include, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings
import django_eventstream


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/rest/auth/", include("rest_framework.urls")),
    path('accounts/', include('djapps.accounts.urls')),
    path("feeds/", include("djapps.feeds.urls")),
    # path("user/<int:pk>/events/", include(django_eventstream.urls), {"format-channels": ["user-{pk}"]}),
    path("notifications/", include("notifications_rest.urls"))
]+staticfiles_urlpatterns()


urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls))
    ]+urlpatterns
