REPORTER = list
MOCHA_OPTS = --ui bdd –c
 
test:
	clear
	echo Starting test *********************************************************
	./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	tests/index.js
	echo Ending test
 
.PHONY: test 