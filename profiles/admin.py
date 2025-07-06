from django.contrib import admin
from .models import Profile, WorkExperience, Education, Skill


class WorkExperienceInline(admin.TabularInline):
    model = WorkExperience
    extra = 0


class EducationInline(admin.TabularInline):
    model = Education
    extra = 0


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 0


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'first_name', 'last_name', 'email', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['first_name', 'last_name', 'email', 'user__username']
    inlines = [WorkExperienceInline, EducationInline, SkillInline]


@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ['profile', 'company', 'position', 'start_date', 'end_date', 'is_current']
    list_filter = ['is_current', 'start_date', 'created_at']
    search_fields = ['company', 'position', 'profile__first_name', 'profile__last_name']


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['profile', 'institution', 'degree', 'start_date', 'end_date']
    list_filter = ['start_date', 'created_at']
    search_fields = ['institution', 'degree', 'field_of_study', 'profile__first_name', 'profile__last_name']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['profile', 'name', 'level', 'category']
    list_filter = ['level', 'category', 'created_at']
    search_fields = ['name', 'category', 'profile__first_name', 'profile__last_name']
