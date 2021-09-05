FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
COPY . /app
WORKDIR /app
RUN useradd winds -mp BigBase123
RUN apt update -y && apt install -y memcached python3.9 python3-pip
RUN pip install -r requirements.txt
RUN chmod 777 ./start.sh
CMD ["./start.sh"]
