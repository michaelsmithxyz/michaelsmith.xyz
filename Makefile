error:
	@echo 'Target required'

check:
	@pnpm --filter "michaelsmith.xyz" exec -- tsc
	@pnpm --filter "michaelsmith.xyz" exec -- wrangler types --check
	@pnpm --filter "jagoff.me" exec -- tsc
	@pnpm --filter "jagoff.me" exec -- wrangler types --check
	@pnpm --filter "smith.pizza" exec -- tsc
	@pnpm --filter "smith.pizza" exec -- wrangler types --check
	@pnpm exec -- oxlint
	@pnpm exec -- oxfmt --check

fmt:
	@pnpm exec -- oxfmt

test:
	@pnpm --filter "smith.pizza" exec -- vitest run

DEPLOY_ENV ?= ""

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

michaelsmith.xyz/deploy: michaelsmith.xyz/build
	@CLOUDFLARE_ENV=$(DEPLOY_ENV) pnpm --filter "michaelsmith.xyz" exec -- wrangler deploy

jagoff.me/codegen:
	@pnpm --filter "jagoff.me" exec -- wrangler types

jagoff.me/run:
	@pnpm --filter "jagoff.me" exec -- wrangler dev

jagoff.me/deploy:
	@CLOUDFLARE_ENV=$(DEPLOY_ENV) pnpm --filter "jagoff.me" exec -- wrangler deploy

smith.pizza/codegen:
	@pnpm --filter "smith.pizza" exec -- wrangler types

smith.pizza/run:
	@pnpm --filter "smith.pizza" exec -- wrangler dev

smith.pizza/deploy:
	@CLOUDFLARE_ENV=$(DEPLOY_ENV) pnpm --filter "smith.pizza" exec -- wrangler deploy
