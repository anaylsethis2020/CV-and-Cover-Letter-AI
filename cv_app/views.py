from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PersonalInfo, Experience, Education, Skill
from .serializers import PersonalInfoSerializer, ExperienceSerializer, EducationSerializer, SkillSerializer
import json

# Create your views here.

@ensure_csrf_cookie
def index(request):
    """Main page with forms"""
    return render(request, 'cv_app/index.html')

# PersonalInfo API Views
@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def personal_info_api(request):
    try:
        personal_info = PersonalInfo.objects.get(user=request.user)
    except PersonalInfo.DoesNotExist:
        personal_info = None

    if request.method == 'GET':
        if personal_info:
            serializer = PersonalInfoSerializer(personal_info)
            return Response(serializer.data)
        return Response({})

    elif request.method == 'POST' or request.method == 'PUT':
        if personal_info:
            serializer = PersonalInfoSerializer(personal_info, data=request.data, partial=True)
        else:
            serializer = PersonalInfoSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED if not personal_info else status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Experience API Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def experience_list_api(request):
    if request.method == 'GET':
        experiences = Experience.objects.filter(user=request.user)
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def experience_detail_api(request, pk):
    try:
        experience = Experience.objects.get(pk=pk, user=request.user)
    except Experience.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExperienceSerializer(experience)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExperienceSerializer(experience, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        experience.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Education API Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def education_list_api(request):
    if request.method == 'GET':
        educations = Education.objects.filter(user=request.user)
        serializer = EducationSerializer(educations, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def education_detail_api(request, pk):
    try:
        education = Education.objects.get(pk=pk, user=request.user)
    except Education.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EducationSerializer(education)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EducationSerializer(education, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        education.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Skill API Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def skill_list_api(request):
    if request.method == 'GET':
        skills = Skill.objects.filter(user=request.user)
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def skill_detail_api(request, pk):
    try:
        skill = Skill.objects.get(pk=pk, user=request.user)
    except Skill.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SkillSerializer(skill)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SkillSerializer(skill, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
