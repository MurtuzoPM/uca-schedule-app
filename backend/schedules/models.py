from django.db import models
from django.contrib.auth.models import AbstractUser

class StudentClass(models.Model):
    YEAR_LEVEL_CHOICES = [
        ('Preparatory', 'Preparatory Year'),
        ('Freshman', 'Freshman Year'),
        ('Sophomore', 'Sophomore Year'),
        ('Junior', 'Junior Year'),
        ('Senior', 'Senior Year'),
    ]
    name = models.CharField(max_length=50)
    year_level = models.CharField(max_length=20, choices=YEAR_LEVEL_CHOICES, default='Freshman')

    def __str__(self):
        return f"{self.name} ({self.year_level})"

class Course(models.Model):
    YEAR_LEVEL_CHOICES = [
        ('Preparatory', 'Preparatory Year'),
        ('Freshman', 'Freshman Year'),
        ('Sophomore', 'Sophomore Year'),
        ('Junior', 'Junior Year'),
        ('Senior', 'Senior Year'),
    ]
    name = models.CharField(max_length=100, unique=True)
    year_level = models.CharField(max_length=20, choices=YEAR_LEVEL_CHOICES, default='Freshman')

    def __str__(self):
        return f"{self.name} ({self.year_level})"

class CustomUser(AbstractUser):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    student_class = models.ForeignKey(StudentClass, on_delete=models.SET_NULL, null=True, blank=True)

class Meal(models.Model):
    student_class = models.ForeignKey(StudentClass, on_delete=models.CASCADE)
    MEAL_TYPES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
    ]
    type = models.CharField(max_length=20, choices=MEAL_TYPES)
    time_start = models.TimeField()
    time_end = models.TimeField()
    menu = models.TextField()

    def __str__(self):
        return f"{self.get_type_display()} ({self.time_start} - {self.time_end}) for {self.student_class}"

class GymSchedule(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    day = models.CharField(max_length=20)
    open_time = models.TimeField()
    close_time = models.TimeField()

    def __str__(self):
        return f"{self.day}: {self.open_time} - {self.close_time} ({self.gender})"

class UniversitySchedule(models.Model):
    student_class = models.ForeignKey(StudentClass, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=100)
    day = models.CharField(max_length=20)
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.course_name} on {self.day} for {self.student_class}"
