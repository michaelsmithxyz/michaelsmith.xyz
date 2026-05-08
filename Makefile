error:
	@echo 'Target required'

check:
	@deno fmt --check
	@deno lint
	@deno check \
		smith.pizza/src/**/*.ts \
		smith.pizza/scripts/**/*.ts \
		jagoff.me/src/**/*.ts
	@pnpm --filter "michaelsmith.xyz" exec -- tsc

fmt:
	@deno fmt

test:
	@deno test -A

smith.pizza/run:
	@deno run -A smith.pizza/src/main.ts

michaelsmith.xyz/codegen:
	@pnpm --filter "michaelsmith.xyz" exec -- wrangler types

michaelsmith.xyz/build: export BROWSERSLIST_IGNORE_OLD_DATA := true
michaelsmith.xyz/build: michaelsmith.xyz/codegen
	@pnpm --filter "michaelsmith.xyz" exec -- tailwindcss \
		--config tailwind.config.js \
		--minify \
		--input src/tailwind/styles.css \
		--output static/styles.css

michaelsmith.xyz/run: michaelsmith.xyz/build
	@pnpm --filter "michaelsmith.xyz" exec -- wrangler dev

DEPLOY_ENV ?= ""
michaelsmith.xyz/deploy: michaelsmith.xyz/build
	@CLOUDFLARE_ENV=$(DEPLOY_ENV) pnpm --filter "michaelsmith.xyz" exec -- wrangler deploy

jagoff.me/run:
	@deno run -A jagoff.me/src/main.ts
