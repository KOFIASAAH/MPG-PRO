from django.urls import path
from .views import TotalPaidInvoicesView

urlpatterns = [
    path('total-paid/', TotalPaidInvoicesView.as_view(), name='total-paid-invoices'),
]
