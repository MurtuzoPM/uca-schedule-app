from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import MealViewSet, GymScheduleViewSet, UniversityScheduleViewSet, RegisterView, StudentClassViewSet, MeView, ChangePasswordView, UserViewSet, CourseViewSet

router = DefaultRouter()
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'gym', GymScheduleViewSet, basename='gym')
router.register(r'classes', UniversityScheduleViewSet, basename='classes')
router.register(r'student-classes', StudentClassViewSet, basename='student-class')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', MeView.as_view(), name='current_user'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
