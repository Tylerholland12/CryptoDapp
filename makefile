run:
	npm run start

compile:
	truffle compile
	truffle migrate
	truffle test

build:
	npm run build

configure:
	npm install --save-dev @babel/register
	