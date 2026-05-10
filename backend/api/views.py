from django.shortcuts import render
from django.contrib.auth.models import User
from  rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserProfile, Appointment, Prescription
from .serializers import UserProfileSerializer, AppointmentSerializer, PrescriptionSerializer, UserSerializer


#* Registration
class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            # update profile with extra fields
            profile = user.profile
            profile.role = request.data.get('role', 'patient')
            profile.phone = request.data.get('phone', '')
            profile.speciality = request.data.get('speciality', '')
            profile.save()

            return Response({'message': 'Account Created!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctor_profiles = UserProfile.objects.filter(role = 'doctor').select_related('user')

        data = [{
            'id' : dp.user.id,
            'name': f"Dr. {dp.user.first_name} {dp.user.last_name}",
            'speciality': dp.speciality,
        } for dp  in doctor_profiles]

        return Response(data)


class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.user.profile.role

        queryset = Appointment.objects.select_related(
            'patient',
            'doctor'
        ).prefetch_related('prescription')

        if role == 'patient':
            queryset = queryset.filter(patient = request.user)
        
        elif role == 'doctor':
            queryset = queryset.filter(doctor = request.user)

        serializer = AppointmentSerializer(queryset, many=True)
        return Response(serializer.data)

        
    def post(self, request):
        if request.user.profile.role != 'patient':
            return Response({"error": 'Only patients can book appointments'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AppointmentSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save(patient = request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class AppointmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Appointment.objects.select_related(
                'patient', 'doctor'
            ).prefetch_related('prescription').get(pk=pk)

        except Appointment.DoesNotExist:
            return None

    def patch(self, request,  pk):
        appt = self.get_object(pk)

        #* permission check
        role = request.user.profile.role
        
        if not appt:
            return Response({'error': 'Not Found'}, status=status.HTTP_404_NOT_FOUND)

        if (request.user != appt.patient and request.user != appt.doctor and role != 'receptionist'):
            return Response({'error': 'Not Allowed'}, status=status.HTTP_403_FORBIDDEN)

        serializer = AppointmentSerializer(appt, data = request.data, partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        appt  = self.get_object(pk)

        role = request.user.profile.role
        if not appt:
            return Response({'error' : 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        if (request.user != appt.patient and request.user != appt.doctor and role != 'receptionist'):
            return Response({'error': 'Not Allowed'}, status=status.HTTP_403_FORBIDDEN)

        appt.delete()
        return Response({"message": 'Appointment Deleted Successfully!'}, status=status.HTTP_204_NO_CONTENT)


class PrescriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.profile.role == 'patient':
            return Prescription.objects.filter(appointment__patient=user)

        elif user.profile.role == 'doctor':
            return Prescription.objects.filter(appointment__doctor=user)

        return Prescription.objects.all()

    def perform_create(self, serializer):
        if self.request.user.profile.role != 'doctor':
            raise PermissionDenied("Only Doctor can create prescriptions")

        serializer.save()



class PrescriptionDetailView(generics.RetrieveAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.profile.role == 'doctor':
            return Prescription.objects.filter(appointment__doctor = user)

        elif user.profile.role == 'patient':
            return Prescription.objects.filter(appointment__patient = user)

        return Prescription.objects.all()


class  ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user = request.user, defaults={'role': 'patient'})
        
        return Response({
            'username' : request.user.username,
            'role': profile.role,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'email': request.user.email,
        })