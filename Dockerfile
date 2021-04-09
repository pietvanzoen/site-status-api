FROM hayd/deno:latest

EXPOSE 8080

WORKDIR /app

USER deno

COPY . /app
RUN deno cache --import-map=deps.json --lock=lock.json main.ts

ENV DEBUG=main,server
CMD ["run", "--cached-only", "--import-map=deps.json", "--lock=lock.json", "--allow-env", "--allow-read", "--allow-net", "main.ts"]
