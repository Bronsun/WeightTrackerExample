
FROM python:3.10-slim
WORKDIR /app

# Copy to the workdir inside docker
COPY ./requirements.txt .

# Update pip and install all python libraries needed
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy all code to the workdir
COPY . /app
EXPOSE 8000

# Start the project
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]