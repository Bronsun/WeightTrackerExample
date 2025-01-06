from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import MassReading
from datetime import date

class MassReadingAPITests(APITestCase):
    
    # Entry data
    def setUp(self):
        self.reading_1 = MassReading.objects.create(date=date(2025, 1, 5), mass=85.8)
        self.reading_2 = MassReading.objects.create(date=date(2025, 1, 2), mass=86.0)
        self.list_url = reverse('readings-list')
    
    # Testing the GET response from /readings 
    # Should return the list of the all readings from the endpoint
    # To assert correctness we check if in the response data we have to 2 objects. The same amount that we created in setup
    def test_list_readings(self):
    
        response = self.client.get(self.list_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    # Testing the POST /readings
    # 201 response should be if we created a new record
    def test_create_reading(self):
        
        new_date = {
            "date": "2025-01-06",
            "mass": 75.5
        }
        
        response = self.client.post(self.list_url, new_date, format='json')
        
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])
        self.assertEqual(MassReading.objects.count(), 3)
        self.assertTrue(MassReading.objects.filter(date="2025-01-06").exists())

    # Testing for overwrite in POST /readings
    # 200 response should be if we overwrite the existing one
    def test_overwrite_existing_reading(self):
        
        data_to_overwrite = {
            "date": "2025-01-06",
            "mass": 65.0
        }
        
        response = self.client.post(self.list_url, data_to_overwrite, format='json')
        
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        updated_reading = MassReading.objects.get(date="2025-01-06")
        self.assertEqual(updated_reading.mass, 65.0)     
    
    # Testing for POST request with negative value in mass
    # If negative should be 400 BAD REQUEST and also no added record to the database
    def test_create_negative_mass_fails(self):
   
        new_date = {
            "date": "2025-01-04",
            "mass": -85.8
        }
        response = self.client.post(self.list_url, new_date, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        self.assertEqual(MassReading.objects.count(), 2)
        self.assertFalse(MassReading.objects.filter(date="2025-01-04").exists())
        
   # Testing for POST request with future date
   # If future date is true show 400 BAD REQUEST and no added record to the database
    def test_create_future_date_fails(self):
   
        new_data = {
            "date": "2045-01-01",
            "mass": 54
        }
        response = self.client.post(self.list_url, new_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(MassReading.objects.count(), 2)
        self.assertFalse(MassReading.objects.filter(date="2050-01-01").exists())
        
    # Testing PUT /endpoint/{date}
    def test_update_reading(self):
    
        detail_url = reverse('readings-detail', kwargs={'date': '2025-01-02'})
        updated_data = {
            "date": "2025-01-02",
            "mass": 34.2
        }
        response = self.client.put(detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.reading_2.refresh_from_db()
        self.assertEqual(self.reading_2.mass, 34.2)

     # Testing DELETE /endpoint/{date}
    def test_delete_reading(self):
       
        detail_url = reverse('readings-detail', kwargs={'date': '2025-01-05'})
        response = self.client.delete(detail_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MassReading.objects.filter(date="2025-01-05").exists())