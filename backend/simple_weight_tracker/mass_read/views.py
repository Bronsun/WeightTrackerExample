from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import MassReading
from .serializers import MassReadingSerializer
from datetime import date

class MassReadingViewSet(viewsets.ModelViewSet):
    queryset = MassReading.objects.all().order_by('date')
    serializer_class = MassReadingSerializer
    lookup_field = 'date'

    def get_object(self):
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        return get_object_or_404(MassReading, **filter_kwargs)

    def perform_create(self, serializer):
        reading_date = serializer.validated_data['date']
        mass = serializer.validated_data['mass']

        existing_reading = MassReading.objects.filter(date=reading_date).first()
        if existing_reading:
            existing_reading.mass = mass
            existing_reading.save()
            return
        else:
            serializer.save()