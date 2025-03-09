error:
	@echo 'Target required'

check:
	@deno fmt --check
	@deno lint
	@deno check \
		michelsmith.xyz/src/**/*.ts \
		michelsmith.xyz/src/**/*.tsx \
		smith.pizza/src/**/*.ts \
		smith.pizza/scripts/**/*.ts

fmt:
	@deno fmt

smith.pizza/run:
	@deno run -A smith.pizza/src/main.ts

michaelsmith/build:
	@deno run -A npm:tailwindcss@3.4.1 \
		--config michaelsmith.xyz/tailwind.config.js \
		--minify \
		--input michaelsmith.xyz/src/tailwind/styles.css \
		--output michaelsmith.xyz/static/styles.css

michaelsmith.xyz/run: michaelsmith/build
	@cd michaelsmith.xyz; \
		deno run -A src/main.tsx
