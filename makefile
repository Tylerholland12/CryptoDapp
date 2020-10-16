run:
	npm run start

reset:
	truffle migrate --reset

build:
	npm run build

configure:
	npm install
	npm install --save-dev @babel/register

try:
	truffle test
	