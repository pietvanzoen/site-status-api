
install:
	deno cache api.ts

test:
	deno fmt --check

dev:
	deno run --allow-net --allow-read --allow-env ./api.ts

build: test
	docker build -t pietvanzoen/site-status-api:latest .

deploy:
	docker push pietvanzoen/site-status-api:latest
