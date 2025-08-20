from rest_framework import permissions

class IsFinanceUser(permissions.BasePermission):
    """
    Allows access only to users with the Finance role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'FINANCE'
