from django.contrib import admin
from .models import UserProfile, Appointment, Prescription, Notification

admin.site.register(UserProfile)
admin.site.register(Appointment)
admin.site.register(Prescription)
admin.site.register(Notification)