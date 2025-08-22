from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from core.models import UserProfile, Branch

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Create groups
        groups = ['Head of Finance', 'Operations', 'HR']
        for group_name in groups:
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Group '{group_name}' created."))

        # Create branches
        branch1, created = Branch.objects.get_or_create(name='Main Branch', location='City Center')
        if created:
            self.stdout.write(self.style.SUCCESS(f"Branch '{branch1.name}' created."))

        branch2, created = Branch.objects.get_or_create(name='North Branch', location='Uptown')
        if created:
            self.stdout.write(self.style.SUCCESS(f"Branch '{branch2.name}' created."))

        # Create test users
        users_data = [
            {'username': 'finance_user', 'password': 'password', 'email': 'finance@example.com', 'group': 'Head of Finance', 'role': 'head_of_finance', 'branch': None},
            {'username': 'ops_user', 'password': 'password', 'email': 'ops@example.com', 'group': 'Operations', 'role': 'operations', 'branch': branch1},
            {'username': 'hr_user', 'password': 'password', 'email': 'hr@example.com', 'group': 'HR', 'role': 'hr', 'branch': None},
            {'username': 'admin', 'password': 'password', 'email': 'admin@example.com', 'group': None, 'role': None, 'is_superuser': True},
        ]

        for user_data in users_data:
            if not User.objects.filter(username=user_data['username']).exists():
                user = User.objects.create_user(
                    username=user_data['username'],
                    password=user_data['password'],
                    email=user_data['email']
                )
                if user_data.get('is_superuser'):
                    user.is_superuser = True
                    user.is_staff = True
                    user.save()

                if user_data['group']:
                    group = Group.objects.get(name=user_data['group'])
                    user.groups.add(group)

                if user_data['role']:
                    UserProfile.objects.create(user=user, role=user_data['role'], branch=user_data['branch'])

                self.stdout.write(self.style.SUCCESS(f"User '{user_data['username']}' created."))

        self.stdout.write(self.style.SUCCESS('Data seeding complete.'))
