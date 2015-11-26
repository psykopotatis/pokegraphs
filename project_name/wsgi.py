"""
WSGI config for project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_name.settings")

from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise

"""
Adding whitenoise. Application will now serve static assets directly from Gunicorn in production.
This will be perfectly adequate for most applications, but top-tier applications
may want to explore using a CDN with Django-Storages.
"""
application = get_wsgi_application()
application = DjangoWhiteNoise(application)