error:
	@echo 'Target required'

check:
	@deno fmt --check **/*.ts **/*.tsx
	@deno lint
	@deno check $(wildcard *.ts **/*.ts **/*.tsx)

build:
	@deno run -A dev.ts build

run:
	@deno run -A --watch=static/,routes/ dev.ts