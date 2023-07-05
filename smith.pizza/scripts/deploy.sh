#!/usr/bin/env bash

rm -rf dist/
mkdir dist/
deno bundle src/main.ts dist/smith-pizza.ts
# deployctl deploy --project=smith-pizza main.ts
