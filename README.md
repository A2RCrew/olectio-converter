# Olectio Converter

Olectio Converter is an open source project developed in TypeScript, designed to transform PDFs and EPUBs into HTML5 documents. 

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [API Reference](#api-reference)
- [Building](#building)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Olectio Converter allows developers and content producers to convert their PDF and EPUB files into responsive, navigable, and accessible HTML5 documents. Utilizing modern web standards and best practices, the converted HTML5 output ensures maximum readability and compatibility across different platforms and devices.

## Features

- Converts PDF and EPUB files into responsive HTML5 documents
- Supports batch conversion
- Maintains the original formatting as closely as possible
- Provides CLI and API usage for integration with other software

## Installation

You can install Olectio Converter by using npm:

```
npm install olectio-converter
```

or using pnpm:

```
pnpm add olectio-converter
```

Ensure you have the latest version of Node.js 18 installed to run the converter.

## Usage

### CLI Usage

After installing Olectio Converter, you can convert files from the command line like so:

```
olectio-converter --input my-ebook.pdf --output my-ebook.html
```

### API Usage

You can also use the Olectio Converter API in your TypeScript or JavaScript project like so:

```typescript
import { convert } from 'olectio-converter';

const inputFile = 'my-ebook.pdf';
const outputFile = 'my-ebook.html';

convert(inputFile, outputFile)
  .then(() => console.log('Conversion successful'))
  .catch(error => console.error('Conversion failed', error));
```

### API Reference

For more detailed information on how to use the API, please refer to our [API documentation](docs/api.md).

## Building

To build the project from source, clone the repository then run:

```
npm install
npm run build
```

## Testing

This project uses Jest for testing. To run, you can use the following command:

```
npm test
```

We encourage contributors to write and run tests to ensure that the features work as expected.

## Contributing

Olectio Converter welcomes contributions from the open source community. Before contributing, please read our [contributing guide](CONTRIBUTING.md). 

For major changes, please open an issue first to discuss what you would like to change. 

## License

Olectio Converter is released under the [GNU License](LICENSE).

## Contact

For questions, suggestions, or just to chat about Olectio Converter, feel free to reach out to us through our [GitHub Discussions board](https://github.com/username/olectio-converter/discussions).

## Acknowledgements

Thanks to all contributors and users of Olectio Converter. This project is possible thanks to your valuable feedback and contributions.
