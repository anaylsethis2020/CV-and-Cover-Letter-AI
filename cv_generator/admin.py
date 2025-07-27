from django.contrib import admin
from .models import CVTemplate, CV, CoverLetter, GeneratedPDF


@admin.register(CVTemplate)
class CVTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_premium', 'created_at')
    list_filter = ('is_premium', 'created_at')
    search_fields = ('name', 'description')


@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'first_name', 'last_name', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'first_name', 'last_name', 'title')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(CoverLetter)
class CoverLetterAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_title', 'company_name', 'is_ai_generated', 'created_at')
    list_filter = ('is_ai_generated', 'created_at')
    search_fields = ('user__username', 'job_title', 'company_name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(GeneratedPDF)
class GeneratedPDFAdmin(admin.ModelAdmin):
    list_display = ('user', 'file_type', 'created_at')
    list_filter = ('file_type', 'created_at')
    search_fields = ('user__username', 'file_path')
    readonly_fields = ('created_at',) 