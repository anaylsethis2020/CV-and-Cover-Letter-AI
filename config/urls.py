from django.contrib import admin
from django.urls import path, include  # ✅ include is added

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),  # ✅ this links to your app’s urls.py
]
