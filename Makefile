
install:
	deno cache api.ts

dev:
	deno run --allow-net --allow-read --allow-env ./api.ts

build:
	docker build -t pietvanzoen/site-status-api:latest .

deploy:
	docker push pietvanzoen/site-status-api:latest
