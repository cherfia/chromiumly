# Chromiumly

![build](https://github.com/cherfia/chromiumly/actions/workflows/build.yml/badge.svg)
[![coverage](https://img.shields.io/codecov/c/gh/cherfia/chromiumly?style=flat-square)](https://codecov.io/gh/cherfia/chromiumly)
[![vulnerabilities](https://snyk.io/test/github/cherfia/chromiumly/badge.svg?targetFile=package.json&color=brightgreen&style=flat-square)](https://snyk.io/test/github/cherfia/chromiumly?targetFile=package.json)
[![maintainability](https://img.shields.io/codeclimate/maintainability/cherfia/chromiumly?color=yellow&style=flat-square)](https://codeclimate.com/github/cherfia/chromiumly/maintainability)
[![npm](https://img.shields.io/npm/v/chromiumly?color=brightgreen&style=flat-square)](https://npmjs.org/package/chromiumly)
[![downloads](https://img.shields.io/npm/dt/chromiumly.svg?color=brightgreen&style=flat-square)](https://npm-stat.com/charts.html?package=chromiumly)
![licence](https://img.shields.io/github/license/cherfia/chromiumly?style=flat-square)

A lightweight Typescript library that interacts with [Gotenberg](https://gotenberg.dev/)'s different modules to convert
a variety of document formats to PDF files.

# Table of Contents

1. [Introduction](#introduction)
   - [Install](#install)
   - [Prerequisites](#prerequisites)
   - [Get Started](#get-started)
2. [Configuration](#configuration)
   - [dotenv](#dotenv)
   - [config](#config)
3. [Modules](#modules)
   - [Chromium](#chromium)
     - [URL](#url)
     - [HTML](#html)
     - [Markdown](#markdown)
   - [Customization](#customization)
     - [Conversion](#conversion)
     - [Screenshot](#screenshot)
   - [PDF Engine](#pdf-engine)
     - [convert](#convert)
     - [readMetadata](#readmetadata)
     - [writeMetadata](#writemetadata)
     - [merge](#merge)
     - [generate](#generate)
4. [Snippet](#snippet)

## Install

Using npm:

```bash
npm install chromiumly
```

Using yarn:

```bash
yarn add chromiumly
```

## Prerequisites

Before attempting to use Chromiumly, be sure you install [Docker](https://www.docker.com/) if you have not already done
so.

After that, you can start a default Docker container of [Gotenberg](https://gotenberg.dev/) as follows:

```bash
docker run --rm -p 3000:3000 gotenberg/gotenberg:8
```

## Get Started

### Configuration

Chromiumly supports both [dotenv](https://www.npmjs.com/package/dotenv)
and [config](https://www.npmjs.com/package/config) configuration libraries to add Gotenberg endpoint to your project.

#### dotenv

```bash
GOTENBERG_ENDPOINT=http://localhost:3000
```

#### config

```json
{
  "gotenberg": {
    "endpoint": "http://localhost:3000"
  }
}
```

## Modules

Chromiumly introduces different classes that serve as wrappers to
Gotenberg's [routes](https://gotenberg.dev/docs/routes). These classes encompass methods featuring an
input file parameter, such as `html`, `header`, `footer`, and `markdown`, capable of accepting inputs in the form of a
`string` (i.e. file path), `Buffer`, or `ReadStream`.

### Chormium

There are three different classes that come with a single method (i.e.`convert`) which calls one of
Chromium's [Conversion routes](https://gotenberg.dev/docs/routes#convert-with-chromium) to convert `html` and `markdown` files, or
a `url` to a `buffer` which contains the converted PDF file content.

Similarly, a new set of classes have been added to harness the recently introduced Gotenberg [Screenshot routes](https://gotenberg.dev/docs/routes#screenshots-route). These classes include a single method called `capture`, which allows capturing full-page screenshots of `html`, `markdown`, and `url`.

#### URL

```typescript
import { UrlConverter } from "chromiumly";

const urlConverter = new UrlConverter();
const buffer = await urlConverter.convert({
  url: "https://www.example.com/",
});
```

```typescript
import { UrlScreenshot } from "chromiumly";

const screenshot = new UrlScreenshot();
const buffer = await screenshot.capture({
  url: "https://www.example.com/",
});
```

#### HTML

The only requirement is that the file name should be `index.html`.

```typescript
import { HtmlConverter } from "chromiumly";

const htmlConverter = new HtmlConverter();
const buffer = await htmlConverter.convert({
  html: "path/to/index.html",
});
```

```typescript
import { HtmlScreenshot } from "chromiumly";

const screenshot = new HtmlScreenshot();
const buffer = await screenshot.capture({
  html: "path/to/index.html",
});
```

#### Markdown

This route accepts an `index.html` file plus a markdown file.

```typescript
import { MarkdownConverter } from "chromiumly";

const markdownConverter = new MarkdownConverter();
const buffer = await markdownConverter.convert({
  html: "path/to/index.html",
  markdown: "path/to/file.md",
});
```

```typescript
import { MarkdownScreenshot } from "chromiumly";

const screenshot = new MarkdownScreenshot();
const buffer = await screenshot.capture({
  html: "path/to/index.html",
  markdown: "path/to/file.md",
});
```

### Customization

#### Conversion

`convert()` method takes an optional `properties` parameter of the following type which dictates how the PDF generated
file will look like.

```typescript
type PageProperties = {
  singlePage?: boolean; // Print the entire content in one single page (default false)
  size?: {
    width: number; // Paper width, in inches (default 8.5)
    height: number; //Paper height, in inches (default 11)
  };
  margins?: {
    top: number; // Top margin, in inches (default 0.39)
    bottom: number; // Bottom margin, in inches (default 0.39)
    left: number; // Left margin, in inches (default 0.39)
    right: number; // Right margin, in inches (default 0.39)
  };
  preferCssPageSize?: boolean; // Define whether to prefer page size as defined by CSS (default false)
  printBackground?: boolean; // Print the background graphics (default false)
  omitBackground?: boolean; // Hide the default white background and allow generating PDFs with transparency (default false)
  landscape?: boolean; // Set the paper orientation to landscape (default false)
  scale?: number; // The scale of the page rendering (default 1.0)
  nativePageRanges?: { from: number; to: number }; // Page ranges to print
};
```

In addition to the `PageProperties` customization options, the `convert()` method also accepts a set of parameters to further enhance the versatility of the conversion process. Here's an overview of the full list of parameters:

```typescript
type ConversionOptions = {
  properties?: PageProperties; // Customize the appearance of the generated PDF
  pdfFormat?: PdfFormat; // Define the PDF format for the conversion
  pdfUA?: boolean; // Enable PDF for Universal Access for optimal accessibility (default false)
  userAgent?: string; // Customize the user agent string sent during conversion
  header?: PathLikeOrReadStream; // Specify a custom header for the PDF
  footer?: PathLikeOrReadStream; // Specify a custom footer for the PDF
  emulatedMediaType?: EmulatedMediaType; // Specify the emulated media type for conversion
  waitDelay?: string; // Duration (e.g., '5s') to wait when loading an HTML document before conversion
  waitForExpression?: string; // JavaScript expression to wait before converting an HTML document into PDF
  extraHttpHeaders?: Record<string, string>; // Include additional HTTP headers in the request
  failOnHttpStatusCodes?: number[]; // List of HTTP status codes triggering a 409 Conflict response (default [499, 599])
  failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if there are exceptions in the Chromium console (default false)
  skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default false)
  metadata?: Metadata; // Metadata to be written.
};
```

#### Screenshot

Similarly, the `capture()` method takes an optional `properties` parameter of the specified type, influencing the appearance of the captured screenshot file.

```typescript
type ImageProperties = {
  format: "png" | "jpeg" | "webp"; //The image compression format, either "png", "jpeg" or "webp".
  quality?: number; // The compression quality from range 0 to 100 (jpeg only).
  omitBackground?: boolean; // Hide the default white background and allow generating screenshots with transparency.
};
```

Furthermore, alongside the customization options offered by `ImageProperties`, the `capture()` method accommodates a variety of parameters to expand the versatility of the screenshot process. Below is a comprehensive overview of all parameters available:

```typescript
type ScreenshotOptions = {
  properties?: ImageProperties;
  header?: PathLikeOrReadStream;
  footer?: PathLikeOrReadStream;
  emulatedMediaType?: EmulatedMediaType;
  waitDelay?: string; // Duration (e.g, '5s') to wait when loading an HTML document before convertion.
  waitForExpression?: string; // JavaScript's expression to wait before converting an HTML document into PDF until it returns true.
  extraHttpHeaders?: Record<string, string>;
  failOnHttpStatusCodes?: number[]; // Return a 409 Conflict response if the HTTP status code is in the list (default [499,599])
  failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if there are exceptions in the Chromium console (default false)
  skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default false)
  optimizeForSpeed?: boolean; // Define whether to optimize image encoding for speed, not for resulting size.
};
```

### PDF Engine

The `PDFEngine` combines the functionality of
Gotenberg's [PDF Engines](https://gotenberg.dev/docs/routes#convert-into-pdfa--pdfua-route)
and [LibreOffice](https://gotenberg.dev/docs/routes#convert-with-libreoffice) modules to manipulate different file formats.

#### convert

This method interacts with [LibreOffice](https://gotenberg.dev/docs/routes#convert-with-libreoffice) module to convert different
documents to PDF files. You can find the file extensions
accepted [here](https://gotenberg.dev/docs/routes#convert-with-libreoffice#route).

```typescript
import { PDFEngine } from "chromiumly";

const buffer = await PDFEngine.convert({
  files: ["path/to/file.docx", "path/to/file.png"],
});
```

Similarly to Chromium's module `convert` method, this method takes the following optional parameters :

- `properties`: changes how the PDF generated file will look like.
- `pdfFormat`: PDF format of the conversion resulting file (i.e. `PDF/A-1a`, `PDF/A-2b`, `PDF/A-3b`).
- `merge`: merge all the resulting files from the conversion into an individual PDF file.

#### merge

This method interacts with [PDF Engines](https://gotenberg.dev/docs/routes#merge-pdfs-route) module which gathers different
engines that can manipulate and merge PDF files such
as: [PDFtk](https://gitlab.com/pdftk-java/pdftk), [PDFcpu](https://github.com/pdfcpu/pdfcpu), [QPDF](https://github.com/qpdf/qpdf),
and [UNO](https://github.com/unoconv/unoconv).

```typescript
import { PDFEngine } from "chromiumly";

const buffer = await PDFEngine.merge({
  files: ["path/to/file.docx", "path/to/file.png"],
});
```

#### readMetadata

This method reads metadata from the provided PDF files.

```typescript
import { PDFEngine } from "chromiumly";

const metadataBuffer = await PDFEngine.readMetadata([
  "path/to/file_1.pdf",
  "path/to/file_2.pdf",
]);
```

#### writeMetadata

This method writes metadata to the provided PDF files.

```typescript
import { PDFEngine } from "chromiumly";

const buffer = await PDFEngine.writeMetadata({
  files: [
  "path/to/file_1.pdf",
  "path/to/file_2.pdf",
  ],
  metadata: {
    Author: 'Taha Cherfia',
    Tite: 'Chromiumly'
    Keywords: ['pdf', 'html', 'gotenberg'],
  }
});
```

Please consider referring to [ExifTool](https://exiftool.org/TagNames/XMP.html#pdf) for a comprehensive list of accessible metadata options.

#### generate

It is just a generic complementary method that takes the `buffer` returned by the `convert` method, and a
chosen `filename` to generate the PDF file.

Please note that all the PDF files can be found `__generated__` folder in the root folder of your project.

## Snippet

The following is a short snippet of how to use the library.

```typescript
import { PDFEngine, UrlConverter } from "chromiumly";

async function run() {
  const urlConverter = new UrlConverter();
  const buffer = await urlConverter.convert({
    url: "https://gotenberg.dev/",
  });

  await PDFEngine.generate("gotenberg.pdf", buffer);
}

run();
```
