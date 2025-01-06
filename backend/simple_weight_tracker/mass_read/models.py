from django.db import models

class MassReading(models.Model):
    date = models.DateField(unique=True) #one day one mass reading
    mass = models.FloatField()
    
    def __str__(self):
        return f"{self.date} - {self.mass} kg"