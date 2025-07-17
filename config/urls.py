from django.urls import path
from core import views

urlpatterns = [
    path('', views.cover_letter_prompt_view, name='generator'),
    path('create-checkout-session/', views.create_checkout_session, name='create-checkout-session'),
    path('success/', views.payment_success_view, name='success'),
    path('cancel/', views.payment_cancel_view, name='cancel'),
]
