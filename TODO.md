
- fix init-module-scripts/index.js to be run not only in the project root



- add a test for tsc downlevelIteration - should compile iteration over Iterable<T>

- add a test: to run jest for .d.ts files

- call npm with require npm, not with child_process.spawn

- storybook support

- generate documentation ("docs": "documentation --config documentation.yml readme src --section=API",)

- colorize messages like 'building', 'pushing', 'testing' etc.

- move typings to `dist/module` folder

- add integral tests:
	- test should
		- make temporary folder
		- put their package.json and some source files
		- do some tasks
		- check

- use some right argv processing
