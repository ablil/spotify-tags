scope ?= ui

.PHONY:
	echo 'Run deploy target'

# Ensure VERCEL_TOKEN is set
ifndef VERCEL_TOKEN
	$(error VERCEL_TOKEN is not set. Please export it as an environment variable.)
endif

deploy-backend:
	sam build -s spotify-tags -t spotify-tags/template.yaml
	sam validate -t spotify-tags/template.yaml
	sam deploy --config-file samconfig.toml --force-upload -t spotify-tags/template.yaml --no-fail-on-empty-changeset

vercel-build:
	vercel build

deploy-frontend: vercel-build
	vercel deploy --prebuilt

