from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.db.models import Sum
from django.contrib.auth.models import User
from .models import Transaction, Notification, UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=Transaction)
def check_expense_cap(sender, instance, created, **kwargs):
    if created:
        branch = instance.branch
        today = timezone.now().date()

        daily_expenses = Transaction.objects.filter(
            branch=branch,
            timestamp__date=today
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        if daily_expenses > branch.daily_expense_cap:
            # Find the Head of Finance user
            try:
                head_of_finance_profile = UserProfile.objects.get(role='head_of_finance')

                # Create a notification
                message = f"Branch '{branch.name}' has exceeded its daily expense cap of {branch.daily_expense_cap}. Current expenses: {daily_expenses}."
                Notification.objects.create(
                    user=head_of_finance_profile,
                    message=message
                )
            except UserProfile.DoesNotExist:
                # Handle case where no Head of Finance user is found
                pass
