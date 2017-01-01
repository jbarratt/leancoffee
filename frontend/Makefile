build: templates
	echo "Build complete"

watch:
	justrun -c "make templates" templates/

templates: $(shell find templates/ -type f -iname *.njk)
	nunjucks-precompile templates/*.njk > templates.js


.PHONY: build
