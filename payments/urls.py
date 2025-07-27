from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    path('subscription-plans/', views.subscription_plans, name='subscription_plans'),
    path('create-checkout-session/', views.create_checkout_session, name='create_checkout_session'),
    path('success/', views.success, name='success'),
    path('cancel/', views.cancel, name='cancel'),
    path('webhook/', views.stripe_webhook, name='stripe_webhook'),
    path('subscription-management/', views.subscription_management, name='subscription_management'),
] 