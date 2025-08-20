from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/payroll/', include('payroll.urls')),
    path('api/invoicing/', include('invoicing.urls')),
    path('api/reporting/', include('reporting.urls')),
]
