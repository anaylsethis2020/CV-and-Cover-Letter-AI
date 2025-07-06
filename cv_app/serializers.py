from rest_framework import serializers
from .models import PersonalInfo, Experience, Education, Skill

class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalInfo
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'summary', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'company', 'position', 'description', 'start_date', 'end_date', 'is_current', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'is_current', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']