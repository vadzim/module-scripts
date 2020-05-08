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
