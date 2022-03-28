# Chromiumly

A lightweight Typescrpit library which interacts with [Gotenberg](https://gotenberg.dev/)'s different modules to convert a variety of document formats to PDF files.

## Prerequisites

Before attempting to use Chromiumly, be sure you install [Docker](https://www.docker.com/) if you have not already done so.

After that, you can start a default Docker container of [Gotenberg](https://gotenberg.dev/) as follows:

```bash
docker run --rm -p 3000:3000 gotenberg/gotenberg:7
```

## Get Started

### Configuration

Chromiumly supports both [dotenv](https://www.npmjs.com/package/dotenv) and [config](https://www.npmjs.com/package/config) configuration libraries to add Gotenberg endpoint to your project.

#### dotenv

```bash
GOTENBERG_ENDPOINT=http://localhost:3000
```

#### config

```json
{
  "gotenberg": {
    "enpdoint": "http://localhost:3000"
  }
}
```

## Modules

Chromiumly introduces different classes that serve as wrappers to Gotenberg's [modules](https://gotenberg.dev/docs/modules/api#modules).

### Chormium

There are three different classes that come with a single method (i.e.`convert`) which calls one of Chromium's [routes](https://gotenberg.dev/docs/modules/chromium#routes) to convert `html` and `markdown` files, or a `url` to a `buffer` which contains the converted PDF file content.

#### URL

```typescript
import { UrlConverter } from "chromiumly";

const urlConverter = new UrlConverter();
const buffer = await urlConverter.convert({
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

### Customization

`convert()` method takes an optional `properties` parameter of the following type which dictates how the PDF generated file will look like.

```typescript
type PageProperties = {
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
  landscape?: boolean; // Set the paper orientation to landscape (default false)
  scale?: number; // The scale of the page rendering (default 1.0)
  nativePageRanges?: { from: number; to: number }; // Page ranges to print
};
```

### PDF Engine

The `PDFEngine` combines the functionality of both Gotenberg's [PDF Engines](https://gotenberg.dev/docs/modules/pdf-engines) and [LibreOffice](https://gotenberg.dev/docs/modules/libreoffice) modules to manipulate different file formats.

#### convert

This method interacts with [LibreOffice](https://gotenberg.dev/docs/modules/libreoffice) module to convert different documents to PDF files. You can find the file extensions accepted [here](https://gotenberg.dev/docs/modules/libreoffice#route).

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

This method interacts with [PDF Engines](https://gotenberg.dev/docs/modules/pdf-engines) module which gathers different engines that can manipulate and merge PDF files such as: [PDFtk](https://gitlab.com/pdftk-java/pdftk), [PDFcpu](https://github.com/pdfcpu/pdfcpu), [QPDF](https://github.com/qpdf/qpdf), and [UNO](https://github.com/unoconv/unoconv).

```typescript
import { PDFEngine } from "chromiumly";

const buffer = await PDFEngine.merge({
  files: ["path/to/file.docx", "path/to/file.png"],
});
```

#### generate

It is just a generic complementary method that takes the `buffer` returned by the `convert` method, and a chosen `filename` to generate the PDF file.

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
