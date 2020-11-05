FROM steelburn/ionic
COPY . /app/project
COPY build.sh /app
COPY run.sh /app
WORKDIR /app
RUN sh build.sh

EXPOSE 8080 80 8100
CMD ["sh", "run.sh"]

