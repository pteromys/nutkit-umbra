all: dist/umbra.min.js

.PHONY: watchcss watchify

dist/umbra.js: src/*.js package.json
	npm run build

dist/umbra.min.js: dist/umbra.js package.json
	npm run minify

watchify:
	npm run watchify

COMPASS = PATH=$(shell gem env gempath | sed -e 's?:\|$$$$?/bin:?g')$(PATH) sh -c 'compass COMPASSCMD --sourcemap --sass-dir src --css-dir dist'

dist/umbra.css: src/umbra.scss package.json
	$(subst COMPASSCMD,compile,$(COMPASS))

watchcss:
	$(subst COMPASSCMD,watch,$(COMPASS))

clean:
	rm dist/umbra.*
