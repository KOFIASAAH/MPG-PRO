from rest_framework.views import APIView
from rest_framework.response import Response
from invoicing.models import Invoice
from invoicing.permissions import IsFinanceUser
from django.db.models import Sum

class TotalPaidInvoicesView(APIView):
    permission_classes = [IsFinanceUser]

    def get(self, request, format=None):
        total_paid = Invoice.objects.filter(status='PAID').aggregate(total=Sum('total_amount'))['total'] or 0
        data = {
            'total_paid_invoices': total_paid
        }
        return Response(data)
