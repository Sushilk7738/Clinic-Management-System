from django.urls import path
from .views import (
    RegisterView,
    DoctorListView,
    AppointmentListCreateView,
    AppointmentDetailView,
    PrescriptionListCreateView,
    PrescriptionDetailView,
    ProfileView,
    AvailableSlotsView,
    FullyBookedDatesView,
    NotificationListView,
    MarkNotificationReadView,
)





urlpatterns = [
    path('register/', RegisterView.as_view()),

    path('profile/', ProfileView.as_view(), name='profile'),

    path('doctors/', DoctorListView.as_view()),
    
    path('appointments/', AppointmentListCreateView.as_view()),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view()),
    path("available-slots/", AvailableSlotsView.as_view(), name="available-slots"),

    path('prescriptions/', PrescriptionListCreateView.as_view()),
    path('prescriptions/<int:pk>/', PrescriptionDetailView.as_view()),
    
    path('fully-booked-dates/', FullyBookedDatesView.as_view()),
    
    path('notifications/', NotificationListView.as_view()),
    path('notifications/<int:pk>/read/', MarkNotificationReadView.as_view()),
]