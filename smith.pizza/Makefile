error:
	@echo 'Target required'

DENO_PERMISSIONS=--allow-read --allow-write --allow-env --allow-net
DENO_RUN=deno run ${DENO_PERMISSIONS}

SMITH_PIZZA_ENTRYPOINT=src/main.ts
SMITH_PIZZA_DIST_DIR=dist
SMITH_PIZZA_BUNDLE=${SMITH_PIZZA_DIST_DIR}/smith-pizza.ts

run:
	${DENO_RUN} ${SMITH_PIZZA_ENTRYPOINT}

check:
	deno fmt --check && deno lint && deno check src/**/*.ts

build:
	rm -rf ${SMITH_PIZZA_DIST_DIR}
	mkdir ${SMITH_PIZZA_DIST_DIR}
	deno bundle ${SMITH_PIZZA_ENTRYPOINT} ${SMITH_PIZZA_BUNDLE}

generateHmacKey:
	${DENO_RUN} scripts/generateHmacKey.ts

validateApiKey:
	${DENO_RUN} scripts/validateApiKey.ts --key ${API_KEY}

generateApiKey:
	${DENO_RUN} scripts/generateApiKey.ts

setupPostgres:
	${DENO_RUN} scripts/setupPostgres.ts
