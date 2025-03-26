
.DEFAULT_GOAL := help

.PHONY: help setup run/e2e run/e2e/watch test/static static/fix

help: ## Show help
	@echo "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:"
	@grep -E '^[a-zA-Z0-9_/%\-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-28s\033[0m %s\n", $$1, $$2}'

setup: ## Install package dependencies
	npm install

run/e2e/generate/%: ## Starts e2e test in docker environment and generates screenshots
	CYPRESS_SPEC_FILE=$*  CYPRESS_SCREENSHOT_TEST_GENERATE=true npm run run:cypress

run/e2e: ## Run all of the e2e test suits
	CYPRESS_SPEC_FILE=**/* npm run run:cypress

run/e2e/%: ## Run part of e2e test suite
	CYPRESS_SPEC_FILE=$* npm run run:cypress

run/e2e/watch: ## Starts e2e test in watchmode - opens development tool
	CYPRESS_SCREENSHOT_TEST_THRESHOLD=0.9 npm run run:cypress:watch

test/static: ## Runs static code analysis
	npm run test:typescript
	npm run test:static

static/fix:	## Auto fixes some lint errors, formats code and writes changes to files
	npm run test:static:fix

