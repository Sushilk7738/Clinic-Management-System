from django.urls import path
from .views import (
    RegisterView,
    DoctorListView,
    AppointmentListCreateView,
    AppointmentDetailView,
    PrescriptionListCreateView,
    PrescriptionDetailView,
    ProfileView,
)




urlpatterns = [
    path('register/', RegisterView.as_view()),

    path('profile/', ProfileView.as_view(), name='profile'),

    path('doctors/', DoctorListView.as_view()),
    
    path('appointments/', AppointmentListCreateView.as_view()),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view()),

    path('prescriptions/', PrescriptionListCreateView.as_view()),
    path('prescriptions/<int:pk>/', PrescriptionDetailView.as_view()),
]