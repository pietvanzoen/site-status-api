
install:
	deno cache main.ts

test:
	deno test --allow-env

dev:
	deno run --allow-net --allow-read --allow-env ./main.ts

build: test
	docker build -t pietvanzoen/site-status-api:latest .

deploy:
	docker push pietvanzoen/site-status-api:latest
