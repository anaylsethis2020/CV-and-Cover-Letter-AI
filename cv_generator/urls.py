from django.urls import path
from . import views

app_name = 'cv_generator'

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('cv-builder/', views.cv_builder, name='cv_builder'),
    path('cv-builder-pro/', views.cv_builder_comprehensive, name='cv_builder_comprehensive'),
    path('parse-cv-ajax/', views.parse_cv_ajax, name='parse_cv_ajax'),
    path('analyze-job-ajax/', views.analyze_job_ajax, name='analyze_job_ajax'),
    path('test-job-analysis/', views.test_job_analysis, name='test_job_analysis'),
    path('preview-cv-ajax/', views.preview_cv_ajax, name='preview_cv_ajax'),
    path('cv-preview/<int:template_id>/', views.cv_preview, name='cv_preview'),
    path('cv-editor/<int:cv_id>/', views.cv_editor, name='cv_editor'),
    path('cv-editor/<int:cv_id>/add-experience/', views.add_experience, name='add_experience'),
    path('cv-editor/<int:cv_id>/add-education/', views.add_education, name='add_education'),
    path('cv-editor/<int:cv_id>/add-project/', views.add_project, name='add_project'),
    path('cover-letter-generator/', views.cover_letter_generator, name='cover_letter_generator'),
    path('cover-letter/<int:cover_letter_id>/', views.cover_letter_view, name='cover_letter_view'),
    path('export-pdf/', views.export_pdf, name='export_pdf'),
    path('user-guide/', views.user_guide, name='user_guide'),
    path('delete-cv/<int:cv_id>/', views.delete_cv, name='delete_cv'),
    path('delete-cover-letter/<int:cover_letter_id>/', views.delete_cover_letter, name='delete_cover_letter'),
] 