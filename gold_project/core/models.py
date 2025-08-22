from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    USER_ROLE_CHOICES = (
        ('head_of_finance', 'Head of Finance'),
        ('operations', 'Operations'),
        ('hr', 'HR'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES)
    branch = models.ForeignKey('Branch', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.username

class Branch(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=100)
    id_number = models.CharField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=20)
    id_image = models.ImageField(upload_to='customer_ids/')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.name

class Rate(models.Model):
    rate_per_gram = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    setter = models.ForeignKey(UserProfile, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.rate_per_gram} at {self.timestamp}"

class Transaction(models.Model):
    PAYMENT_MODE_CHOICES = (
        ('cash', 'Cash'),
        ('mobile_money', 'Mobile Money'),
        ('bank', 'Bank'),
    )
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('flagged', 'Flagged'),
    )
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT)
    gold_weight = models.DecimalField(max_digits=10, decimal_places=2)
    purity = models.DecimalField(max_digits=5, decimal_places=2) # Carat
    rate = models.ForeignKey(Rate, on_delete=models.PROTECT)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    gold_image = models.ImageField(upload_to='gold_images/')
    timestamp = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Transaction {self.id} by {self.customer.name}"

class Expenditure(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField()

    def __str__(self):
        return f"Expenditure of {self.amount} for {self.branch.name}"

class Employee(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.user.user.username

class Payroll(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    pay_date = models.DateField()

    def __str__(self):
        return f"Payroll for {self.employee.user.user.username} on {self.pay_date}"
