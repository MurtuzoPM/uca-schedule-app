from rest_framework import serializers
from .models import Meal, GymSchedule, UniversitySchedule, CustomUser, StudentClass, Course

class StudentClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentClass
        fields = ['id', 'name', 'year_level']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'gender', 'student_class')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            gender=validated_data.get('gender'),
            student_class=validated_data.get('student_class')
        )
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'gender', 'student_class')

class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'gender', 'student_class', 'is_superuser', 'is_staff')

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        exclude = ['student_class']

class GymScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymSchedule
        exclude = ['gender']

class UniversityScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversitySchedule
        exclude = ['student_class']

class AdminUniversityScheduleSerializer(serializers.ModelSerializer):
    student_class_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=True
    )
    
    class Meta:
        model = UniversitySchedule
        fields = '__all__'
        read_only_fields = ['student_class']

class AdminMealSerializer(serializers.ModelSerializer):
    student_class_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=True
    )

    class Meta:
        model = Meal
        fields = '__all__'
        read_only_fields = ['student_class']

class AdminGymScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymSchedule
        fields = '__all__'
