FROM hayd/deno:latest

EXPOSE 8080

WORKDIR /app

USER deno

COPY . /app
RUN deno cache api.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "api.ts"]
