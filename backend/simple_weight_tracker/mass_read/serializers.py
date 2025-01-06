from rest_framework import serializers
from .models import MassReading
from datetime import date

class MassReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MassReading
        fields = ('date','mass')
        
    def validate_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Cannot use future date")
        return value
    
    def validate_mass(self,value):
        if value <=0:
            raise serializers.ValidationError("Mass cannot be a negative number")
        return value