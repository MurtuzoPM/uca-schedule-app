import os
import django
from datetime import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'university_scheduler.settings')
django.setup()

from schedules.models import Meal, GymSchedule, UniversitySchedule, StudentClass

def populate():
    if StudentClass.objects.exists():
        print("Data already exists")
        return

    class_a = StudentClass.objects.create(name='Class A')
    class_b = StudentClass.objects.create(name='Class B')

    Meal.objects.create(student_class=class_a, type='breakfast', time_start=time(7, 0), time_end=time(9, 0), menu='Eggs, Toast, Coffee')
    Meal.objects.create(student_class=class_a, type='lunch', time_start=time(12, 0), time_end=time(14, 0), menu='Sandwich, Salad, Juice')
    Meal.objects.create(student_class=class_b, type='breakfast', time_start=time(8, 0), time_end=time(10, 0), menu='Pancakes, Milk')

    GymSchedule.objects.create(gender='Male', day='Monday', open_time=time(6, 0), close_time=time(22, 0))
    GymSchedule.objects.create(gender='Female', day='Tuesday', open_time=time(6, 0), close_time=time(22, 0))

    UniversitySchedule.objects.create(student_class=class_a, course_name='Math 101', day='Monday', start_time=time(9, 0), end_time=time(10, 30), location='Room 101')
    UniversitySchedule.objects.create(student_class=class_b, course_name='Physics 101', day='Tuesday', start_time=time(11, 0), end_time=time(12, 30), location='Room 102')

    print("Data populated!")

if __name__ == '__main__':
    populate()
