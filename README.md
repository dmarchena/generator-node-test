# generator-node-test [![Build Status](https://secure.travis-ci.org/dmarchena/generator-node-test.png?branch=develop)](https://travis-ci.org/dmarchena/generator-node-test)

> Yet another [Yeoman](http://yeoman.io) generator that scaffolds a TDD-ready node project


## Installation

**Not  available yet. It's still the `develop` branch. Be patient, please. ;)**

To install generator-node-test from npm, run:

```bash
npm install -g generator-node-test
```

## Generate a new project

Make a new directory and cd into it mkdir -p my-project && cd $_

Just launch the generator:

```bash
yo node-test
```

## Testing

The project generated by generator includes the following npm scripts:

* Run both linter and local tests:

  ```bash
  npm test
  ```

* Run local tests only:

  ```bash
  npm run karma
  ```

* Run linter only:

  ```bash
  npm run lint
  ```

## License

MIT
