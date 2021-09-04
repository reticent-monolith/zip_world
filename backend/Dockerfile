FROM winds_base
COPY . /app
WORKDIR /app
RUN ["pip","install","-r","requirements.txt"]
RUN ["chmod","777","start.sh"]
CMD ["./start.sh"]
