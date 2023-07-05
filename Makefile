error:
	@echo 'Target required'

DENO_PERMISSIONS=--allow-read --allow-env --allow-net
DENO_RUN=deno run ${DENO_PERMISSIONS}

SMITH_PIZZA_BASE=./smith.pizza
SMITH_PIZZA_ENTRYPOINT=${SMITH_PIZZA_BASE}/src/main.ts
SMITH_PIZZA_DIST_DIR=${SMITH_PIZZA_BASE}/dist
SMITH_PIZZA_BUNDLE=${SMITH_PIZZA_DIST_DIR}/smith-pizza.ts

smith.pizza/run:
	${DENO_RUN} ${SMITH_PIZZA_BASE}/src/main.ts

smith.pizza/check:
	deno check ${SMITH_PIZZA_ENTRYPOINT}

smith.pizza/deploy:
	rm -rf ${SMITH_PIZZA_DIST_DIR}
	mkdir ${SMITH_PIZZA_DIST_DIR}
	deno bundle ${SMITH_PIZZA_ENTRYPOINT} ${SMITH_PIZZA_BUNDLE}
# deployctl deploy --project=smith-pizza main.ts

smith.pizza/generateHmacKey:
	${DENO_RUN} ${SMITH_PIZZA_BASE}/scripts/generateHmacKey.ts

smith.pizza/validateApiKey:
	${DENO_RUN} ${SMITH_PIZZA_BASE}/scripts/validateApiKey.ts --key ${API_KEY}

smith.pizza/generateApiKey:
	${DENO_RUN} ${SMITH_PIZZA_BASE}/scripts/generateApiKey.ts

smith.pizza/setupPostgres:
	${DENO_RUN} ${SMITH_PIZZA_BASE}/scripts/setupPostgres.ts
