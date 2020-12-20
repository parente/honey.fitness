.PHONY: help builder build clean image imagex watch

help:
# http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -E '^[a-zA-Z0-9_%/-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Build production assets
	@yarn build

builder: ## Create a dockerx docker-container build for multi-arch build + push
	@docker buildx create --use --name build --node build --driver docker-container --driver-opt network=host

clean: ## Clean the workspace
	@rm -rf ./node_modules
	@rm -rf ./.next

image: ## Build a local docker image
	@DOCKER_BUILDKIT=1 docker buildx build --load --tag honey-fitness:latest .

imagex: ## Make multi-arch platform images and push to GHCR as latest
	@DOCKER_BUILDKIT=1 docker buildx build \
		--push \
		--platform linux/amd64,linux/arm/v7 \
		--tag ghcr.io/parente/honey-fitness:latest .

watch: ## Build, run, and watch for dev changes
	@yarn dev
