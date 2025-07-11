from django.urls import path
from .views import cover_letter_prompt_view

urlpatterns = [
    path('', cover_letter_prompt_view, name='cover_letter_prompt'),
]
