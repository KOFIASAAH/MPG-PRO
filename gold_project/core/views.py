from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum
from .decorators import role_required
from .forms import TransactionForm, CashOutForm, CashInForm, RateForm, PayrollForm
from .models import Rate, Transaction, Employee, Payroll

@login_required
@role_required(allowed_roles=['operations'])
def quick_buy_entry(request):
    if not request.user.userprofile.branch:
        return render(request, 'core/error.html', {'message': 'You are not assigned to any branch.'})

    try:
        latest_rate = Rate.objects.latest('timestamp')
    except Rate.DoesNotExist:
        return render(request, 'core/error.html', {'message': 'The gold rate has not been set yet.'})

    if request.method == 'POST':
        form = TransactionForm(request.POST, request.FILES)
        if form.is_valid():
            transaction = form.save(commit=False)

            transaction.rate = latest_rate

            # Calculate total amount
            transaction.total_amount = transaction.gold_weight * (transaction.purity / 24) * latest_rate.rate_per_gram

            # Set the branch from the logged-in user
            transaction.branch = request.user.userprofile.branch

            transaction.save()
            return redirect('core:todays_transactions')
    else:
        form = TransactionForm()

    return render(request, 'core/quick_buy_entry.html', {'form': form, 'latest_rate': latest_rate})

@login_required
@role_required(allowed_roles=['operations'])
def todays_transactions(request):
    branch = request.user.userprofile.branch
    transactions = Transaction.objects.filter(branch=branch, timestamp__date=timezone.now().date())
    return render(request, 'core/todays_transactions.html', {'transactions': transactions})

@login_required
@role_required(allowed_roles=['operations'])
def cash_out(request):
    if request.method == 'POST':
        form = CashOutForm(request.POST)
        if form.is_valid():
            customer = form.cleaned_data['customer']
            amount = form.cleaned_data['amount']
            customer.balance += amount
            customer.save()
            return redirect('core:cash_out') # Redirect to the same page for now
    else:
        form = CashOutForm()

    return render(request, 'core/cash_out.html', {'form': form})

@login_required
@role_required(allowed_roles=['operations'])
def cash_in(request):
    if request.method == 'POST':
        form = CashInForm(request.POST)
        if form.is_valid():
            customer = form.cleaned_data['customer']
            amount = form.cleaned_data['amount']
            customer.balance -= amount
            customer.save()
            return redirect('core:cash_in') # Redirect to the same page for now
    else:
        form = CashInForm()

    return render(request, 'core/cash_in.html', {'form': form})

# Head of Finance Views
@login_required
@role_required(allowed_roles=['head_of_finance'])
def finance_dashboard(request):
    today = timezone.now().date()

    # Daily Purchase Summary
    daily_total_weight = Transaction.objects.filter(timestamp__date=today).aggregate(Sum('gold_weight'))['gold_weight__sum'] or 0
    daily_total_amount = Transaction.objects.filter(timestamp__date=today).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

    payment_breakdown = Transaction.objects.filter(timestamp__date=today).values('payment_mode').annotate(total=Sum('total_amount'))

    # Chart Data (last 30 days)
    chart_data = []
    for i in range(30):
        date = today - timedelta(days=i)
        daily_total = Transaction.objects.filter(timestamp__date=date).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        chart_data.append({'date': date.strftime('%Y-%m-%d'), 'total': daily_total})

    context = {
        'daily_total_weight': daily_total_weight,
        'daily_total_amount': daily_total_amount,
        'payment_breakdown': payment_breakdown,
        'chart_data': chart_data,
    }
    return render(request, 'core/finance_dashboard.html', context)

@login_required
@role_required(allowed_roles=['head_of_finance'])
def set_rate(request):
    if request.method == 'POST':
        form = RateForm(request.POST)
        if form.is_valid():
            rate = form.save(commit=False)
            rate.setter = request.user.userprofile
            rate.save()
            return redirect('core:rate_history')
    else:
        form = RateForm()

    return render(request, 'core/set_rate.html', {'form': form})

@login_required
@role_required(allowed_roles=['head_of_finance'])
def rate_history(request):
    rates = Rate.objects.all().order_by('-timestamp')
    return render(request, 'core/rate_history.html', {'rates': rates})

@login_required
@role_required(allowed_roles=['head_of_finance'])
def approve_transactions(request):
    return render(request, 'core/approve_transactions.html')

@login_required
@role_required(allowed_roles=['head_of_finance'])
def flagged_transactions(request):
    return render(request, 'core/flagged_transactions.html')

# HR Views
@login_required
@role_required(allowed_roles=['hr'])
def hr_dashboard(request):
    # For now, HR dashboard shows the same as finance dashboard
    return finance_dashboard(request)

@login_required
@role_required(allowed_roles=['hr'])
def payroll_list(request):
    employees = Employee.objects.all()
    return render(request, 'core/payroll_list.html', {'employees': employees})

@login_required
@role_required(allowed_roles=['hr'])
def pay_payroll(request):
    if request.method == 'POST':
        form = PayrollForm(request.POST)
        if form.is_valid():
            payroll = form.save(commit=False)
            payroll.pay_date = timezone.now().date()
            payroll.save()
            return redirect('core:payroll_list')
    else:
        form = PayrollForm()

    return render(request, 'core/pay_payroll.html', {'form': form})
