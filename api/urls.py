from django.urls import path
from .views import ProjectListView, SkillListView, ContactMessageCreateView

urlpatterns = [
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('stack/', SkillListView.as_view(), name='skill-list'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),
]
