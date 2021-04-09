FROM hayd/deno:latest

EXPOSE 8080

WORKDIR /app

USER deno

COPY . /app
RUN deno cache --import-map=deps.json --lock=lock.json main.ts

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD wget -nv -t1 --spider 'http://localhost:8080/healthcheck' || exit 1

ENV DEBUG=main,server
CMD ["run", "--cached-only", "--import-map=deps.json", "--lock=lock.json", "--allow-env", "--allow-read", "--allow-net", "main.ts"]
