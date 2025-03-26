
.DEFAULT_GOAL := help

.PHONY: help setup run

help: ## Show help
	@echo "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:"
	@grep -E '^[a-zA-Z0-9_/%\-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-28s\033[0m %s\n", $$1, $$2}'

setup: ## Install package dependencies
	pnpm install

run/dev : ## Run the application in development environment
	pnpm run dev

build : ## Run the application in development environment
	pnpm run build

serve : ## Run the application in development environment
	pnpm run preview

docker/frontend: ## Run the frontend in docker environment
	docker-compose up --build react-app -d

e2e/setup: ## Run the e2e tests in docker environment
	cd e2e && make setup

e2e/run: ## Run the e2e tests in docker environment and generate new screenshots
	cd e2e && make run/e2e
