from django.contrib import admin
from .models import UserProfile, Appointment, Prescription

admin.site.register(UserProfile)
admin.site.register(Appointment)
admin.site.register(Prescription)