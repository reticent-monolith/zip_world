FROM python:latest
COPY . /app
WORKDIR /app
RUN ["pip3", "install", "-r", "requirements.txt"]
CMD ["uvicorn", "app:app", "--host", "zip_world_backend_1"]