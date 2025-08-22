from .models import Notification, UserProfile

def unread_notifications(request):
    if request.user.is_authenticated:
        try:
            user_profile = request.user.userprofile
            return {
                'unread_notifications': Notification.objects.filter(user=user_profile, is_read=False)
            }
        except UserProfile.DoesNotExist:
            return {'unread_notifications': []}
    return {}
