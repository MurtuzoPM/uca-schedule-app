from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Meal, GymSchedule, UniversitySchedule, StudentClass, CustomUser, Course
from .serializers import (
    MealSerializer, GymScheduleSerializer, UniversityScheduleSerializer, 
    RegisterSerializer, UserUpdateSerializer, ChangePasswordSerializer, 
    StudentClassSerializer, AdminUserUpdateSerializer, CourseSerializer,
    AdminUniversityScheduleSerializer, AdminMealSerializer, AdminGymScheduleSerializer
)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'is_superuser': user.is_superuser,
            'gender': user.gender,
            'student_class': user.student_class.id if user.student_class else None,
            'student_class_name': user.student_class.name if user.student_class else None,
            'student_class_year': user.student_class.year_level if user.student_class else None,
        })

    def put(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'old_password': ['Wrong password.']}, status=400)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({'status': 'password set'}, status=200)
        return Response(serializer.errors, status=400)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class StudentClassViewSet(viewsets.ModelViewSet):
    queryset = StudentClass.objects.all()
    serializer_class = StudentClassSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Or IsAdminUser for write

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class MealViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.user.is_superuser and self.action in ['create', 'update', 'partial_update']:
            return AdminMealSerializer
        return MealSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            class_id = self.request.query_params.get('student_class_id')
            if class_id:
                return Meal.objects.filter(student_class_id=class_id)
            return Meal.objects.all()
        
        if user.student_class:
            return Meal.objects.filter(student_class=user.student_class)
        return Meal.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_superuser:
            student_class_ids = self.request.data.get('student_class_ids', [])
            if not student_class_ids:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'student_class_ids': 'Admin must specify at least one Student Class ID.'})
            
            # Create meal for each selected class group
            created_meals = []
            for class_id in student_class_ids:
                try:
                    student_class = StudentClass.objects.get(id=class_id)
                    meal = Meal.objects.create(
                        student_class=student_class,
                        type=serializer.validated_data.get('type'),
                        time_start=serializer.validated_data.get('time_start'),
                        time_end=serializer.validated_data.get('time_end'),
                        menu=serializer.validated_data.get('menu')
                    )
                    created_meals.append(meal)
                except StudentClass.DoesNotExist:
                    from rest_framework.exceptions import ValidationError
                    raise ValidationError({'detail': f'Student class with ID {class_id} does not exist.'})
            
            # Return the first created meal (for response consistency)
            if created_meals:
                serializer.instance = created_meals[0]
        else:
            # Should not be reached due to permissions
            if not user.student_class:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'student_class': 'You must have a class assigned to add meals. Please update your profile.'})
            serializer.save(student_class=user.student_class)

class GymScheduleViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.user.is_superuser and self.action in ['create', 'update', 'partial_update']:
            return AdminGymScheduleSerializer
        return GymScheduleSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            gender = self.request.query_params.get('gender')
            if gender:
                return GymSchedule.objects.filter(gender=gender)
            return GymSchedule.objects.all()
        
        if user.gender:
            return GymSchedule.objects.filter(gender=user.gender)
        return GymSchedule.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        
        # Validate Time Range first
        start = serializer.validated_data.get('open_time')
        end = serializer.validated_data.get('close_time')
        day = serializer.validated_data.get('day')

        if start and end and start >= end:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'detail': 'Open time must be before close time.'})

        if user.is_superuser:
            # Admin must provide gender in the request data
            gender = serializer.validated_data.get('gender')
            if not gender:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'gender': 'Admin must specify a gender for gym schedule.'})
            
            # Validate Overlap for this gender
            overlaps = GymSchedule.objects.filter(
                gender=gender,
                day=day,
                open_time__lt=end,
                close_time__gt=start
            ).exists()
            
            if overlaps:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'detail': 'This time slot overlaps with an existing gym schedule.'})
            
            serializer.save()
        else:
            # Students shouldn't reach here due to permissions, but just in case
            if not user.gender:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'gender': 'You must have a gender assigned to add gym schedules. Please update your profile.'})
            
            # Validate Overlap for student's gender
            overlaps = GymSchedule.objects.filter(
                gender=user.gender,
                day=day,
                open_time__lt=end,
                close_time__gt=start
            ).exists()
            
            if overlaps:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'detail': 'This time slot overlaps with an existing gym schedule.'})
            
            serializer.save(gender=user.gender)

class UniversityScheduleViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.user.is_superuser and self.action in ['create', 'update', 'partial_update']:
            return AdminUniversityScheduleSerializer
        return UniversityScheduleSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            # Admins can filter by student_class_id if provided, otherwise see all
            class_id = self.request.query_params.get('student_class_id')
            if class_id:
                return UniversitySchedule.objects.filter(student_class_id=class_id)
            return UniversitySchedule.objects.all()
        
        # Students only see their own class schedule
        if user.student_class:
            return UniversitySchedule.objects.filter(student_class=user.student_class)
        return UniversitySchedule.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        
        if user.is_superuser:
            student_class_ids = self.request.data.get('student_class_ids', [])
            if not student_class_ids:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'student_class_ids': 'Admin must specify at least one Student Class ID.'})
            
            # Validate Time Range
            start = serializer.validated_data.get('start_time')
            end = serializer.validated_data.get('end_time')
            day = serializer.validated_data.get('day')

            if start and end and start >= end:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'detail': 'Start time must be before end time.'})

            # Create schedule for each selected class group
            created_schedules = []
            for class_id in student_class_ids:
                try:
                    student_class = StudentClass.objects.get(id=class_id)
                    
                    # Check for overlaps in this specific class
                    overlaps = UniversitySchedule.objects.filter(
                        student_class=student_class,
                        day=day,
                        start_time__lt=end,
                        end_time__gt=start
                    ).exists()

                    if overlaps:
                        from rest_framework.exceptions import ValidationError
                        raise ValidationError({
                            'detail': f'This class overlaps with another class in {student_class.name}\'s schedule.'
                        })
                    
                    # Create the schedule for this class
                    schedule = UniversitySchedule.objects.create(
                        student_class=student_class,
                        course_name=serializer.validated_data.get('course_name'),
                        day=day,
                        start_time=start,
                        end_time=end,
                        location=serializer.validated_data.get('location')
                    )
                    created_schedules.append(schedule)
                except StudentClass.DoesNotExist:
                    from rest_framework.exceptions import ValidationError
                    raise ValidationError({'detail': f'Student class with ID {class_id} does not exist.'})
            
            # Return the first created schedule (for response consistency)
            if created_schedules:
                serializer.instance = created_schedules[0]
        else:
            # This block shouldn't be reached due to permissions
            if not user.student_class:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'student_class': 'You must have a class assigned to add lessons. Please update your profile.'})
            serializer.save(student_class=user.student_class)
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer  # We can reuse this or create a specific one
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return AdminUserUpdateSerializer # Use admin serializer for edits

    def list(self, request, *args, **kwargs):
        # Custom list to include ID and other fields
        users = self.get_queryset()
        data = []
        for user in users:
            data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'gender': user.gender,
                'student_class': user.student_class.name if user.student_class else None,
                'student_class_id': user.student_class.id if user.student_class else None,
                'is_superuser': user.is_superuser
            })
        return Response(data)

    def perform_update(self, serializer):
        # Allow admins to update any user
        serializer.save()
