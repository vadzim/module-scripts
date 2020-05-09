# module-scripts

Opinioned scripts for maintaing npm module. Includes linting, testing, transpiling, type checking.

It's like `create-react-app`, but for packages or librarires.

To install or update run
```
npx module-scripts init
```
in your package folder.

`module-scripts` assumes that your source is stored under `src` folder.

Caution: for now it formats the source code with tabs on and semicolons off. Other options are in TODO.

Basically your `package.json` starts to look like
```json
  "main": "dist/commonjs/index.js",
  "module": "dist/module/index.js",
  "esnext": "dist/esnext/index.js",
  "scripts": {
    "compile": "module-scripts compile",
    "clean": "module-scripts clean",
    "types": "module-scripts types",
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

### compile

Compiles the content of the `src` folder and creates three folders with compiled stuff. Supports babel macros.

- `dist/commonjs/`
transplies imports to `require` and most of modern syntax.

- `dist/module/`
transplies less syntax and preserves imports.

- `dist/esnext/`
preserves as much as possible, but still transpiles to standard javascript. Mostly removes type declarations.

### clean

Removes `dist` folder.

### types

Runs `typescript` for type checking and generates type definitions in `dist/types/`.

### build

Cleans the folder, lints, compiles and type checks the code.

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

Calculates test coverage.

### prepack

Builds module after installation from source, e.g. from github and before publishing your package.

### preversion

Lints the code before incrementing the package version.

### prepublishOnly

Lints and tests to ensure all is ok before publishing.

### postpublish

Pushes commits to remote git.
