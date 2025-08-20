from django.db import models
from users.models import User

class Customer(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Invoice(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        SENT = 'SENT', 'Sent'
        PAID = 'PAID', 'Paid'
        CANCELLED = 'CANCELLED', 'Cancelled'

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='invoices')
    date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0) # This should be calculated

    def __str__(self):
        return f"Invoice {self.id} for {self.customer.name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def amount(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return self.description
