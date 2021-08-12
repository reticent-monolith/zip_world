FROM python:latest
COPY . /app
WORKDIR /app
RUN ["pip", "install", "-r", "requirements.txt"]
CMD ["hypercorn", "app:app", "--bind", "zip_world_backend_1"]