import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'university_scheduler.settings')
django.setup()

from schedules.models import StudentClass

count = StudentClass.objects.count()
print(f"StudentClass count: {count}")
if count == 0:
    print("The table is EMPTY. The script ran successfully.")
else:
    print("The table is NOT empty. The script did NOT run (or you need to refresh).")
    print("Existing classes:")
    for c in StudentClass.objects.all():
        print(f"- {c.name} (ID: {c.id})")
