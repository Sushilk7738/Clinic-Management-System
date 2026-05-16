from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('patient',   'Patient'),
        ('doctor',   'Doctor'),
        ('receptionist',   'Receptionist'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    #One user has exactly one profile
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    phone = models.CharField(max_length=15, blank=True)
    speciality = models.CharField(max_length=100, blank=True) #* only used for doctors
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.role != 'doctor' and self.speciality:
            raise ValidationError("Only doctor can have a speciality")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
            

    def __str__(self):
        return f"{self.user.username} - ({self.role})"
    


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True)
    # reason is why the patient is coming in
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'time']
        #* this makes django always return appointments sorted by date and time
        
    def clean(self):
        if not hasattr(self.doctor, 'profile') and self.doctor.profile.role != 'doctor':
            raise ValidationError("Selected doctor is not doctor.")
        
        if not hasattr(self.patient, 'profile') and self.patient.profile.role != 'patient':
            raise ValidationError("Selected patient is not patient.")

        existing_appointment = Appointment.objects.filter(
            doctor = self.doctor,
            date = self.date,
            time = self.time,
            status__in=['pending', 'confirmed']
        ).exclude(id = self.id)

        if existing_appointment.exists():
            raise ValidationError(
                "This doctor already has an appointment at this time."
            )
        
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
            
    
    def __str__(self):
        return f"{self.patient.username} with Dr. {self.doctor.username} on {self.date}"
    

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.message[:30]}"
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    



class Prescription(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription')
    #* each appointment can have only one prescription
    notes = models.TextField(blank=True)
    medicines = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Prescription for {self.appointment}"

