from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'core'

urlpatterns = [
    path('', views.central_dashboard, name='central_dashboard'),

    # Auth
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

    # Notifications
    path('notifications/read/<int:notification_id>/', views.mark_notification_as_read, name='mark_notification_as_read'),

    # Branch Operations
    path('branch/quick-buy/', views.quick_buy_entry, name='quick_buy_entry'),
    path('branch/todays-transactions/', views.todays_transactions, name='todays_transactions'),
    path('branch/cash-out/', views.cash_out, name='cash_out'),
    path('branch/cash-in/', views.cash_in, name='cash_in'),
    path('branch/customer/add/', views.add_customer, name='add_customer'),

    # Head of Finance
    path('finance/dashboard/', views.finance_dashboard, name='finance_dashboard'),
    path('finance/rate/set/', views.set_rate, name='set_rate'),
    path('finance/rate/history/', views.rate_history, name='rate_history'),
    path('finance/transactions/approve/', views.approve_transactions, name='approve_transactions'),
    path('finance/transactions/flagged/', views.flagged_transactions, name='flagged_transactions'),

    # HR
    path('hr/dashboard/', views.hr_dashboard, name='hr_dashboard'),
    path('hr/payroll/', views.payroll_list, name='payroll_list'),
    path('hr/payroll/pay/', views.pay_payroll, name='pay_payroll'),
]
