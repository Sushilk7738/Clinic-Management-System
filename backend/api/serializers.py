from django.contrib.auth.models import User
from .models import Appointment, UserProfile, Prescription
from rest_framework import serializers

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'phone', 'speciality', 'bio']

    def validate(self, data):
        role = data.get('role', getattr(self.instance, 'role', None))
        speciality = data.get('speciality')

        if role != 'doctor' and speciality:
            raise serializers.ValidationError("Only doctors can have a speciality")
        
        return data
        
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only = True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'profile']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password'],
            first_name = validated_data.get('first_name', ''),
            last_name = validated_data.get('last_name', ''),
            email= validated_data.get('email', ''),
        )
        UserProfile.objects.create(user=user)
        
        return user
    

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'patient_name', 'doctor_name',
                'date', 'time', 'status', 'reason', 'created_at']
        extra_kwargs = {
            'patient': {'read_only': True},
        }
        
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def get_doctor_name(self, obj):
        return f"{obj.doctor.first_name} {obj.doctor.last_name}"
    

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'appointment', 'notes', 'medicines', 'created_at']

