from django.urls import path
from . import views

app_name = 'cv_app'

urlpatterns = [
    # Main page
    path('', views.index, name='index'),
    
    # Personal Info API
    path('api/personal-info/', views.personal_info_api, name='personal-info-api'),
    
    # Experience API
    path('api/experiences/', views.experience_list_api, name='experience-list-api'),
    path('api/experiences/<int:pk>/', views.experience_detail_api, name='experience-detail-api'),
    
    # Education API
    path('api/educations/', views.education_list_api, name='education-list-api'),
    path('api/educations/<int:pk>/', views.education_detail_api, name='education-detail-api'),
    
    # Skills API
    path('api/skills/', views.skill_list_api, name='skill-list-api'),
    path('api/skills/<int:pk>/', views.skill_detail_api, name='skill-detail-api'),
]