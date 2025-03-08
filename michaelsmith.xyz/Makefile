error:
	@echo 'Target required'

check:
	@deno fmt --check src/**/*.ts src/**/*.tsx
	@deno lint
	@deno check $(wildcard m**/*.ts **/*.tsx)

build: build-tailwind

build-tailwind:
	@deno run -A npm:tailwindcss@3.4.1 \
		--minify \
		--input src/tailwind/styles.css \
		--output static/styles.css

run: build
	@deno run -A src/main.tsx
