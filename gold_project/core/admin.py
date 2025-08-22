from django.contrib import admin
from .models import (
    UserProfile,
    Branch,
    Customer,
    Rate,
    Transaction,
    Expenditure,
    Employee,
    Payroll,
)

admin.site.register(UserProfile)
admin.site.register(Branch)
admin.site.register(Customer)
admin.site.register(Rate)
admin.site.register(Transaction)
admin.site.register(Expenditure)
admin.site.register(Employee)
admin.site.register(Payroll)
