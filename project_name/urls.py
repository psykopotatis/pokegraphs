from django.conf.urls import patterns, url

urlpatterns = patterns(
    '',
    url(r'^$', 'app_name.views.index', name='index')
)
