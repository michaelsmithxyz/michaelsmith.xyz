error:
	@echo 'Target required'

smith.pizza/check:
	@$(MAKE) -C smith.pizza/ check

smith.pizza/run:
	@$(MAKE) -C smith.pizza/ run

smith.pizza/build:
	@$(MAKE) -C smith.pizza/ build

michaelsmith.xyz/check:
	@$(MAKE) -C michaelsmith.xyz/ check

michaelsmith.xyz/build:
	@$(MAKE) -C michaelsmith.xyz/ build

michaelsmith.xyz/run:
	@$(MAKE) -C michaelsmith.xyz/ run