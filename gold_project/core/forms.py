from django import forms
from .models import Transaction, Customer, Rate, Payroll, Employee

class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['customer', 'gold_weight', 'purity', 'payment_mode', 'gold_image']

class CashOutForm(forms.Form):
    customer = forms.ModelChoiceField(queryset=Customer.objects.all())
    amount = forms.DecimalField(max_digits=10, decimal_places=2)

class CashInForm(forms.Form):
    PAYMENT_CHOICES = (
        ('gold', 'Gold'),
        ('cash', 'Cash'),
    )
    customer = forms.ModelChoiceField(queryset=Customer.objects.all())
    amount = forms.DecimalField(max_digits=10, decimal_places=2)
    payment_type = forms.ChoiceField(choices=PAYMENT_CHOICES)

class RateForm(forms.ModelForm):
    class Meta:
        model = Rate
        fields = ['rate_per_gram']

class PayrollForm(forms.ModelForm):
    class Meta:
        model = Payroll
        fields = ['employee', 'amount']
