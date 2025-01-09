## Weight Tracker Example

Simple weight tracker application used to test the coding ability in Django DRF and React TypeScript

### Stack

Backend:

- Django + DRF

Frontend:

- React
- TypeScript
- React Query
- MUI / MUI Date Picker
- DayJS
- Recharts

Database:

- Postgres

Conterization:

- Docker
- Docker Compose

### How to run the app using docker

All commands run in root of the project
```
git clone https://github.com/Bronsun/WeightTrackerExample.git
```
```
cd WeightTrackerExample
```

Run whole project with tests:
```
docker compose build
```
```
docker compose up
```

Run only tests:
```
docker compose build test
```
```
docker compose run --rm test
```

### Hot to run the app locally without docker
Before starting app ensure that you have installed postgreSQL on your local machine or you are using the external one
https://www.postgresql.org/download/

Install python
https://www.python.org/

#### Backend Setup

1. Clone the repository and navigate to the backend directory:
```
git clone https://github.com/Bronsun/WeightTrackerExample.git
```
```
cd WeightTrackerExample/backend
```

2. Create and activate a virtual environment:
```
python -m venv venv
```
```
source venv/bin/activate # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Configure the PostgreSQL database in settings.py:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'weight_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

5. Apply migrations:
```
python manage.py makemigrations
```
```
python manage.py migrate
```

6. Run the Django development server:
```
python manage.py runserver
```
The backend API will be available at 
http://localhost:8000/readings/

#### Frontend Setup

Install nodejs

1. Navigate to the frontend directory:
```
cd ../frontend
```

2. Install dependencies:
```
yarn install 
```

3. Create a .env file in the frontend root with the API
```
REACT_APP_API = http://localhost:8000
```

## API Documentation

### Endpoints

- **GET** `/readings/`  
  Retrieve a list of all mass readings.

- **POST** `/readings/`  
  Create a new reading.  
  **Request Body:**  
  ```json
  {
    "date": "YYYY-MM-DD",
    "mass": 85.5
  }
  ```
If a record for the same date exists, it overwrites after confirmation.

- **PUT** `/readings/{date}`
Update an existing reading for the specified date.
**Request Body:**
```json
{
  "date": "YYYY-MM-DD",
  "mass": 86.0
}
```
- **DELETE** `/readings/{date}`
Delete a reading for the specified date.

#### Validation and Errors
- Dates must not be in the future.
- Mass values must be positive.
- API returns appropriate HTTP status codes and error messages for invalid input or server errors.
