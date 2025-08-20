from rest_framework import viewsets
from .models import Customer, Invoice
from .serializers import CustomerSerializer, InvoiceSerializer
from .permissions import IsFinanceUser

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsFinanceUser]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-date')
    serializer_class = InvoiceSerializer
    permission_classes = [IsFinanceUser]

    def perform_create(self, serializer):
        # Automatically set the creator of the invoice to the current user
        serializer.save(created_by=self.request.user)
