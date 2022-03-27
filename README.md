# Chromiumly

A lightweight Typescrpit library which interacts with [Gotenberg](https://gotenberg.dev/)'s Chromium module to convert HTML documents to PDF.

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

### Usage

Chromiumly introduces different classes that serve as wrappers to Gotenberg's Chromium [routes](https://gotenberg.dev/docs/modules/chromium#routes).

Each class comes with two methods :  

#### convert

This method takes either a `url`, an `html` file path or `html` and `markdown` file paths and returns a `buffer` which contains the converted PDF file content.

#### generate

 It is just a generic complementary method that takes the `buffer` returned by the `convert` method, and a chosen `filename` to generate the PDF file.

Please note that all the PDF files can be found `__generated__` folder in the root folder of your project  

### Modules

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

### Snippet

The following is a short snippet of how to use the library.

```typescript
import { UrlConverter } from "chromiumly";

async function run() {
  const urlConverter = new UrlConverter();
  const buffer = await urlConverter.convert({
    url: "https://gotenberg.dev/",
  });

  await urlConverter.generate("gotenberg.pdf", buffer);
}

run();
```
