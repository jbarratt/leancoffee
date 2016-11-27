build: templates
	echo "Build complete"

templates: $(shell find templates/ -type f -iname *.njk)
	nunjucks-precompile templates/*.njk > templates.js


.PHONY: build
