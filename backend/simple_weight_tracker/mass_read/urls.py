from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MassReadingViewSet

router = DefaultRouter()
router.register(r'readings', MassReadingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
