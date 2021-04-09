
DENO_DIR = ./.deno
export DENO_DIR
ALLOW_ARGS = --allow-net --allow-read --allow-env
DEP_ARGS = --lock=./lock.json --import-map=./deps.json

clean:
	rm -r $(DENO_DIR)

cache:
	deno cache $(DEP_ARGS) --lock-write main.ts **/*.test.ts

test:
	deno test $(DEP_ARGS) $(ALLOW_ARGS)

dev:
	DEBUG=* denon run --cached-only $(ALLOW_ARGS) $(DEP_ARGS) ./main.ts

build:
	docker build -t pietvanzoen/site-status-api:latest .

start: build
	docker run -it -p 8080:8080 -v $(PWD)/config.yaml:/app/config.yaml --env-file=./.env pietvanzoen/site-status-api:latest

deploy:
	docker push pietvanzoen/site-status-api:latest
