DENO_PERMISSIONS=--allow-read --allow-env --allow-net
DENO_RUN=deno run ${DENO_PERMISSIONS}

error:
	@echo 'Target required'

generateHmacKey:
	${DENO_RUN} scripts/generateHmacKey.ts

validateApiKey:
	${DENO_RUN} scripts/validateApiKey.ts --key ${API_KEY}

generateApiKey:
	${DENO_RUN} scripts/generateApiKey.ts

setupPostgres:
	${DENO_RUN} scripts/setupPostgres.ts

run:
	${DENO_RUN} src/main.ts

deploy:
	./scripts/deploy.sh