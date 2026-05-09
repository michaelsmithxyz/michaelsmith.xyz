error:
	@echo 'Target required'

check:
	@deno fmt --check
	@deno lint --ignore=**/worker-configuration.d.ts
	@deno check \
		smith.pizza/src/**/*.ts \
		smith.pizza/scripts/**/*.ts
	@pnpm --filter "michaelsmith.xyz" exec -- tsc
	@pnpm --filter "michaelsmith.xyz" exec -- wrangler types --check
	@pnpm --filter "jagoff.me" exec -- tsc
	@pnpm --filter "jagoff.me" exec -- wrangler types --check

fmt:
	@deno fmt

test:
	@deno test -A

smith.pizza/run:
	@deno run -A smith.pizza/src/main.ts

michaelsmith.xyz/codegen:
	@pnpm --filter "michaelsmith.xyz" exec -- wrangler types

michaelsmith.xyz/build: export BROWSERSLIST_IGNORE_OLD_DATA := true
michaelsmith.xyz/build:
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

jagoff.me/codegen:
	@pnpm --filter "jagoff.me" exec -- wrangler types

jagoff.me/run:
	@pnpm --filter "jagoff.me" exec -- wrangler dev

jagoff.me/deploy:
	@CLOUDFLARE_ENV=$(DEPLOY_ENV) pnpm --filter "jagoff.me" exec -- wrangler deploy
