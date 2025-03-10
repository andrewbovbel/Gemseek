FROM python:3.10

WORKDIR /AccountService

# Copy only requirements.txt first
COPY AccountService/requirements.txt /AccountService/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY AccountService /AccountService

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]