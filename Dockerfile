FROM hayd/deno:latest

EXPOSE 8080

WORKDIR /app

USER deno

COPY . /app
RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]
