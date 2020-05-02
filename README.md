# module-scripts

Opinioned scripts for maintaing npm module. Includes linting, testing, transpiling.

`module-scripts` assumes that you store source files under `src` folder.

Tip: please don't install or run if you have uncommited changes in your source ;)

Caution: for now it formats the source code with tabs on and semicolons off. Other options are in TODO.

Installation:
```
npm i --save-dev module-scripts
```
or
```
yarn add --dev module-scripts
```

Basically your `package.json` starts to look like
```json
  "main": "dist/commonjs/index.js",
  "module": "dist/module/index.js",
  "esnext": "dist/esnext/index.js",
  "scripts": {
    "build": "module-scripts build",
    "lint": "module-scripts lint",
    "lint:fix": "module-scripts lint:fix",
    "lint:ci": "module-scripts lint:ci",
    "test": "module-scripts test",
    "test:debug": "module-scripts test:debug",
    "coverage": "module-scripts coverage",
    "prepack": "module-scripts prepack",
    "prepublishOnly": "module-scripts prepublishOnly"
  },
  "devDependencies": {
    "module-scripts": "...",
```

No more transpilers, linters and other common noise in `devDependencies`.

`module-scripts` will add absent scripts for you, but existing scripts you should update manually.

Usage: `module-scripts <command>`

## Commands:

### build

Builds content of `src` folder and creates three folders with compiled stuff. Supports babel macros.

- `dist/commonjs/`
transplies imports to `require` and most of modern syntax.

- `dist/module/`
transplies less syntax and preserves imports.

- `dist/esnext/`
preserves as much as possible, but still transpiles to standard javascript. Mostly removes type declarations.

### lint

Checks for lint errors.

### lint:fix

Prettifies the code.

### lint:ci

Like `lint`, but treats all warnings as errors. For CI and prepublishing script.

### test

Runs tests.

### test:debug

Runs tests in debug mode. Opens browser debug tools. Do not forget to insert `debug` statement in your test somewhere for break point.

### coverage

TODO: Calculates test coverage.

### prepack

Builds module after installation from source, e.g. from github.

### prepublishOnly

Lints and tests to ensure all is ok before publishing.
