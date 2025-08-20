from rest_framework import permissions

class IsHRUser(permissions.BasePermission):
    """
    Allows access only to users with the HR role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'HR'
