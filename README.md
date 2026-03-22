<p align="center">
  <img src="assets/logo.png" alt="Chromiumly Logo" width="128" height="auto">
</p>

![build](https://github.com/cherfia/chromiumly/actions/workflows/build.yml/badge.svg)
[![coverage](https://img.shields.io/codecov/c/gh/cherfia/chromiumly?style=flat-square)](https://codecov.io/gh/cherfia/chromiumly)
[![vulnerabilities](https://snyk.io/test/github/cherfia/chromiumly/badge.svg?targetFile=package.json&color=brightgreen&style=flat-square)](https://snyk.io/test/github/cherfia/chromiumly?targetFile=package.json)
[![Maintainability](https://qlty.sh/gh/cherfia/projects/chromiumly/maintainability.svg)](https://qlty.sh/gh/cherfia/projects/chromiumly)
[![npm](https://img.shields.io/npm/v/chromiumly?color=brightgreen&style=flat-square)](https://npmjs.org/package/chromiumly)
[![downloads](https://img.shields.io/npm/dt/chromiumly.svg?color=brightgreen&style=flat-square)](https://npm-stat.com/charts.html?package=chromiumly)
![licence](https://img.shields.io/github/license/cherfia/chromiumly?style=flat-square)

A lightweight Typescript library that interacts with [Gotenberg](https://gotenberg.dev/)'s different routes to convert
a variety of document formats to PDF files.

# Table of Contents

1. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Configuration](#configuration)
2. [Authentication](#authentication)
   - [Basic Authentication](#basic-authentication)
   - [Advanced Authentication](#advanced-authentication)
3. [Core Features](#core-features)
   - [Chromium](#chromium)
     - [URL](#url)
     - [HTML](#html)
     - [Markdown](#markdown)
     - [Screenshot](#screenshot)
   - [LibreOffice](#libreoffice)
   - [PDF Engines](#pdf-engines)
     - [Format Conversion](#format-conversion)
     - [Merging](#merging)
     - [PDF Rotation](#pdf-rotation)
     - [Metadata Management](#metadata-management)
     - [File Generation](#file-generation)
   - [PDF Splitting](#pdf-splitting)
   - [PDF Flattening](#pdf-flattening)
   - [PDF Encryption](#pdf-encryption)
   - [Embedding Files](#embedding-files)
   - [Watermark and stamp](#watermark-and-stamp)
4. [Usage Example](#snippet)

## Getting Started

### Installation

Using npm:

```bash
npm install chromiumly
```

Using yarn:

```bash
yarn add chromiumly
```

### Prerequisites

Before attempting to use Chromiumly, be sure you install [Docker](https://www.docker.com/) if you have not already done
so.

After that, you can start a default Docker container of [Gotenberg](https://gotenberg.dev/) as follows:

```bash
docker run --rm -p 3000:3000 gotenberg/gotenberg:8
```

### Configuration

Chromiumly supports configurations via both [dotenv](https://www.npmjs.com/package/dotenv)
and [config](https://www.npmjs.com/package/config) configuration libraries or directly via code to add Gotenberg endpoint to your project.

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

#### code

```typescript
import { Chromiumly } from "chromiumly";

Chromiumly.configure({ endpoint: "http://localhost:3000" });
```

## Authentication

### Basic Authentication

Gotenberg introduces basic authentication support starting from version [8.4.0](https://github.com/gotenberg/gotenberg/releases/tag/v8.4.0). Suppose you are running a Docker container using the command below:

```bash
docker run --rm -p 3000:3000 \
-e GOTENBERG_API_BASIC_AUTH_USERNAME=user \
-e GOTENBERG_API_BASIC_AUTH_PASSWORD=pass \
gotenberg/gotenberg:8.4.0 gotenberg --api-enable-basic-auth

```

To integrate this setup with Chromiumly, you need to update your configuration as outlined below:

```bash
GOTENBERG_ENDPOINT=http://localhost:3000
GOTENBERG_API_BASIC_AUTH_USERNAME=user
GOTENBERG_API_BASIC_AUTH_PASSWORD=pass
```

Or

```json
{
  "gotenberg": {
    "endpoint": "http://localhost:3000",
    "api": {
      "basicAuth": {
        "username": "user",
        "password": "pass"
      }
    }
  }
}
```

Or

```typescript
Chromiumly.configure({
  endpoint: "http://localhost:3000",
  username: "user",
  password: "pass",
});
```

### Advanced Authentication

To implement advanced authentication or add custom HTTP headers to your requests, you can use the `customHttpHeaders` option within the `configure` method. This allows you to pass additional headers, such as authentication tokens or custom metadata, with each API call.

For example, you can include a Bearer token for authentication along with a custom header as follows:

```typescript
const token = await generateToken();

Chromiumly.configure({
  endpoint: "http://localhost:3000",
  customHttpHeaders: {
    Authorization: `Bearer ${token}`,
    "X-Custom-Header": "value",
  },
});
```

## Core Features

Chromiumly introduces different classes that serve as wrappers to
Gotenberg's [documentation](https://gotenberg.dev/docs/getting-started/introduction). These classes encompass methods featuring an
input file parameter, such as `html`, `header`, `footer`, and `markdown`, capable of accepting inputs in the form of a
`string` (i.e. file path), `Buffer`, or `ReadStream`.

### Chromium

There are three different classes that come with a single method (i.e.`convert`) which calls one of
Chromium's [conversion routes](https://gotenberg.dev/docs/convert-with-chromium/convert-url-to-pdf) to convert `html` and `markdown` files, or
a `url` to a `buffer` which contains the converted PDF file content.

Similarly, a new set of classes have been added to harness the recently introduced Gotenberg [screenshot routes](https://gotenberg.dev/docs/convert-with-chromium/screenshot-url). These classes include a single method called `capture`, which allows capturing full-page screenshots of `html`, `markdown`, and `url`.

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

Each `convert()` method takes an optional `properties` parameter of the following type which dictates how the PDF generated
file will look like.

```typescript
type PageProperties = {
  singlePage?: boolean; // Print the entire content in one single page (default false)
  size?: {
    width: number | string; // Paper width (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 8.5)
    height: number | string; // Paper height (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 11)
  };
  margins?: {
    top: number | string; // Top margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    bottom: number | string; // Bottom margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    left: number | string; // Left margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    right: number | string; // Right margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
  };
  preferCssPageSize?: boolean; // Define whether to prefer page size as defined by CSS (default false)
  printBackground?: boolean; // Print the background graphics (default false)
  omitBackground?: boolean; // Hide the default white background and allow generating PDFs with transparency (default false)
  landscape?: boolean; // Set the paper orientation to landscape (default false)
  scale?: number; // The scale of the page rendering (default 1.0)
  nativePageRanges?: { from: number; to: number }; // Page ranges to print
};
```

**Page Size and Margins Units**

Both `size` and `margins` properties support two formats:

1. **Numeric values** (in inches): For backward compatibility, you can continue using numbers which represent inches.
2. **String values with units**: You can now specify explicit units using the following formats:
   - `pt` (points): e.g., `"72pt"`
   - `px` (pixels): e.g., `"96px"`
   - `in` (inches): e.g., `"1in"`
   - `mm` (millimeters): e.g., `"25.4mm"`
   - `cm` (centimeters): e.g., `"2.54cm"`
   - `pc` (picas): e.g., `"6pc"`

**Examples:**

```typescript
// Using numeric values (inches)
properties: {
  size: { width: 8.5, height: 11 },
  margins: { top: 0.5, bottom: 0.5, left: 1, right: 1 }
}

// Using string values with units
properties: {
  size: { width: "210mm", height: "297mm" }, // A4 size
  margins: { top: "1cm", bottom: "1cm", left: "2cm", right: "2cm" }
}

// Mixing numeric and string values
properties: {
  size: { width: 8.5, height: "11in" },
  margins: { top: "10mm", bottom: 0.5, left: "72pt", right: 1 }
}
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
  emulatedMediaFeatures?: EmulatedMediaFeature[]; // Override CSS media features (e.g., prefers-color-scheme). Default: None.
  waitDelay?: string; // Duration (e.g., '5s') to wait when loading an HTML document before conversion
  waitForExpression?: string; // JavaScript expression to wait before converting an HTML document into PDF
  waitForSelector?: string; // CSS selector to wait for before converting an HTML document into PDF until it matches a node
  extraHttpHeaders?: Record<string, string>; // Include additional HTTP headers in the request
  failOnHttpStatusCodes?: number[]; // List of HTTP status codes triggering a 409 Conflict response (default [499, 599])
  failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if there are exceptions in the Chromium console (default false)
  failOnResourceHttpStatusCodes?: number[]; // Return a 409 Conflict response if resource HTTP status code is in the list (default [499,599])
  ignoreResourceHttpStatusDomains?: string[]; // Domains to exclude from resource HTTP status code checks (matches exact domains or subdomains)
  failOnResourceLoadingFailed?: boolean; // Return a 409 Conflict response if resource loading failed (default false)
  skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default true)
  metadata?: Metadata; // Metadata to be written.
  cookies?: Cookie[]; // Cookies to be written.
  downloadFrom?: DownloadFrom; //Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
  split?: SplitOptions; // Split the PDF file into multiple files.
  userPassword?: string; // Password for opening the resulting PDF(s).
  ownerPassword?: string; // Password for full access on the resulting PDF(s).
  embeds?: PathLikeOrReadStream[]; // Files to embed in the generated PDF.
  watermark?: PdfEngineWatermark; // Optional PDF-engine post-processing watermark (behind page content).
  stamp?: PdfEngineStamp; // Optional PDF-engine post-processing stamp (on top of page content).
};
```

Optional `watermark` and `stamp` use the same multipart field names as [Gotenberg’s PDF-engine watermark/stamp](https://gotenberg.dev/docs/manipulate-pdfs/watermark-pdfs): text, image, or PDF sources, with JSON `options` depending on your configured engine (e.g. pdfcpu). See [Watermark PDFs](https://gotenberg.dev/docs/manipulate-pdfs/watermark-pdfs) and [Stamp PDFs](https://gotenberg.dev/docs/manipulate-pdfs/stamp-pdfs) in the official docs.

```typescript
type PdfEngineWatermark = {
  source?: "text" | "image" | "pdf";
  expression?: string; // Text, or filename of the uploaded asset when source is image or pdf
  pages?: string; // Page ranges (e.g. "1-3"); omit for all pages
  options?: Record<string, unknown>; // Serialized as JSON (engine-specific)
  file?: PathLikeOrReadStream | Buffer; // Required when source is image or pdf
};

type PdfEngineStamp = {
  source?: "text" | "image" | "pdf";
  expression?: string;
  pages?: string;
  options?: Record<string, unknown>;
  file?: PathLikeOrReadStream | Buffer;
};
```

#### Screenshot

Similarly, the `capture()` method takes an optional `properties` parameter of the specified type, influencing the appearance of the captured screenshot file.

```typescript
type ImageProperties = {
  format: "png" | "jpeg" | "webp"; //The image compression format, either "png", "jpeg" or "webp".
  quality?: number; // The compression quality from range 0 to 100 (jpeg only).
  omitBackground?: boolean; // Hide the default white background and allow generating screenshots with transparency.
  width?: number; // The device screen width in pixels (default 800).
  height?: number; // The device screen height in pixels (default 600).
  clip?: boolean; // Define whether to clip the screenshot according to the device dimensions (default false).
};
```

Furthermore, alongside the customization options offered by `ImageProperties`, the `capture()` method accommodates a variety of parameters to expand the versatility of the screenshot process. Below is a comprehensive overview of all parameters available:

```typescript
type ScreenshotOptions = {
  properties?: ImageProperties;
  header?: PathLikeOrReadStream;
  footer?: PathLikeOrReadStream;
  emulatedMediaType?: EmulatedMediaType;
  emulatedMediaFeatures?: EmulatedMediaFeature[]; // Override CSS media features (e.g., prefers-color-scheme). Default: None.
  waitDelay?: string; // Duration (e.g, '5s') to wait when loading an HTML document before convertion.
  waitForExpression?: string; // JavaScript's expression to wait before converting an HTML document into PDF until it returns true.
  waitForSelector?: string; // CSS selector to wait for before converting an HTML document into PDF until it matches a node.
  extraHttpHeaders?: Record<string, string>;
  failOnHttpStatusCodes?: number[]; // Return a 409 Conflict response if the HTTP status code is in the list (default [499,599])
  failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if there are exceptions in the Chromium console (default false)
  failOnResourceHttpStatusCodes?: number[]; // Return a 409 Conflict response if resource HTTP status code is in the list (default [499,599])
  ignoreResourceHttpStatusDomains?: string[]; // Domains to exclude from resource HTTP status code checks (matches exact domains or subdomains)
  failOnResourceLoadingFailed?: boolean; // Return a 409 Conflict response if resource loading failed (default false)
  skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default true)
  optimizeForSpeed?: boolean; // Define whether to optimize image encoding for speed, not for resulting size.
  cookies?: Cookie[]; // Cookies to be written.
  downloadFrom?: DownloadFrom; // Download the file from a specific URL. It must return a Content-Disposition header with a filename parameter.
  userPassword?: string; // Password for opening the resulting PDF(s).
  ownerPassword?: string; // Password for full access on the resulting PDF(s).
  embeds?: PathLikeOrReadStream[]; // Files to embed in the generated PDF.
};
```

### LibreOffice

The `LibreOffice` class comes with a single method `convert`. This method interacts with [LibreOffice](https://gotenberg.dev/docs/convert-with-libreoffice/convert-to-pdf) route to convert different documents to PDF files. You can find the file extensions
accepted [here](https://gotenberg.dev/docs/convert-with-libreoffice/convert-to-pdf).

```typescript
import { LibreOffice } from "chromiumly";

const buffer = await LibreOffice.convert({
  files: [
    "path/to/file.docx",
    "path/to/file.png",
    { data: xlsxFileBuffer, ext: "xlsx" },
  ],
});
```

Similarly to Chromium's route `convert` method, this method takes the following optional parameters :

- `properties`: changes how the PDF generated file will look like. It also includes a `password` parameter to open the source file.
- `pdfa`: PDF format of the conversion resulting file (i.e. `PDF/A-1a`, `PDF/A-2b`, `PDF/A-3b`).
- `pdfUA`: enables PDF for Universal Access for optimal accessibility.
- `merge`: merges all the resulting files from the conversion into an individual PDF file.
- `metadata`: writes metadata to the generated PDF file.
- `losslessImageCompression`: allows turning lossless compression on or off to tweak image conversion performance.
- `reduceImageResolution`: allows turning on or off image resolution reduction to tweak image conversion performance.
- `quality`: specifies the quality of the JPG export. The value ranges from 1 to 100, with higher values producing higher-quality images and larger file sizes.
- `maxImageResolution`: specifies if all images will be reduced to the specified DPI value. Possible values are: `75`, `150`, `300`, `600`, and `1200`.
- `flatten`: a boolean that, when set to true, flattens the split PDF files, making form fields and annotations uneditable.
- `userPassword`: password for opening the resulting PDF(s).
- `ownerPassword`: password for full access on the resulting PDF(s).
- `embeds`: files to embed in the generated PDF (repeatable). This feature enables the creation of PDFs compatible with standards like [ZUGFeRD / Factur-X](https://fnfe-mpe.org/factur-x/), which require embedding XML invoices and other files within the PDF.
- **Native LibreOffice watermarks** (applied during export): `nativeWatermarkText`, `nativeWatermarkColor`, `nativeWatermarkFontHeight`, `nativeWatermarkRotateAngle`, `nativeWatermarkFontName`, `nativeTiledWatermarkText` — see [Convert to PDF](https://gotenberg.dev/docs/convert-with-libreoffice/convert-to-pdf).
- **PDF-engine watermark/stamp** (post-processing after conversion): `watermark` and `stamp` — same shapes as in Chromium `ConversionOptions` (`PdfEngineWatermark` / `PdfEngineStamp`). For `{ data, ext }` file objects, use the same pattern as in `files`.

### PDF Engines

The `PDFEngines` class interacts with Gotenberg's [PDF Engines](https://gotenberg.dev/docs/manipulate-pdfs/pdfa-pdfua) routes to manipulate PDF files.

#### Format Conversion

This method interacts with [PDF Engines](https://gotenberg.dev/docs/manipulate-pdfs/pdfa-pdfua) convertion route to transform PDF files into the requested PDF/A format and/or PDF/UA.

```typescript
import { PDFEngines } from "chromiumly";

const buffer = await PDFEngines.convert({
  files: ["path/to/file_1.pdf", "path/to/file_2.pdf"],
  pdfa: PdfFormat.A_2b,
  pdfUA: true,
});
```

#### Merging

This method interacts with [PDF Engines](https://gotenberg.dev/docs/manipulate-pdfs/merge-pdfs) merge route which gathers different
engines that can manipulate and merge PDF files such
as: [PDFtk](https://gitlab.com/pdftk-java/pdftk), [PDFcpu](https://github.com/pdfcpu/pdfcpu), [QPDF](https://github.com/qpdf/qpdf),
and [UNO](https://github.com/unoconv/unoconv).

```typescript
import { PDFEngines } from "chromiumly";

const buffer = await PDFEngines.merge({
  files: ["path/to/file_1.pdf", "path/to/file_2.pdf"],
  pdfa: PdfFormat.A_2b,
  pdfUA: true,
});
```

Optional `watermark` and `stamp` (`PdfEngineWatermark` / `PdfEngineStamp`) apply PDF-engine post-processing to the merged output, matching [Merge PDFs](https://gotenberg.dev/docs/manipulate-pdfs/merge-pdfs) in the Gotenberg docs.

Optional `rotate` (`{ angle: 90 | 180 | 270; pages?: string }`) rotates pages after merge via the PDF engine; omit `pages` or leave it empty to rotate all pages.

#### PDF Rotation

`PDFEngines.rotate()` calls Gotenberg’s [rotate route](https://gotenberg.dev/docs/manipulate-pdfs/rotate-pdfs) to rotate existing PDFs. The same post-processing is available on `PDFEngines.merge()`, `PDFEngines.split()`, and on Chromium and LibreOffice `convert()` through the optional `rotate` property (Gotenberg generates the PDF, then rotates selected pages—an extra pass).

```typescript
import { PDFEngines } from "chromiumly";

const rotated = await PDFEngines.rotate({
  files: ["path/to/document.pdf"],
  angle: 90,
  pages: "1-3", // optional; omit for all pages
});
```

#### Watermark and stamp (dedicated routes)

These methods call [`/forms/pdfengines/watermark`](https://gotenberg.dev/docs/manipulate-pdfs/watermark-pdfs) and [`/forms/pdfengines/stamp`](https://gotenberg.dev/docs/manipulate-pdfs/stamp-pdfs).

```typescript
import { PDFEngines } from "chromiumly";

const watermarked = await PDFEngines.watermark({
  files: ["path/to/document.pdf"],
  watermark: {
    source: "text",
    expression: "CONFIDENTIAL",
    options: { opacity: 0.25, rotation: 45 },
  },
});

const stamped = await PDFEngines.stamp({
  files: ["path/to/document.pdf"],
  stamp: {
    source: "text",
    expression: "APPROVED",
    options: { opacity: 0.5, rotation: 0 },
  },
});
```

#### Metadata Management

##### readMetadata

This method reads metadata from the provided PDF files.

```typescript
import { PDFEngines } from "chromiumly";

const metadataBuffer = await PDFEngines.readMetadata([
  "path/to/file_1.pdf",
  "path/to/file_2.pdf",
]);
```

##### writeMetadata

This method writes metadata to the provided PDF files.

```typescript
import { PDFEngines } from "chromiumly";

const buffer = await PDFEngines.writeMetadata({
  files: ["path/to/file_1.pdf", "path/to/file_2.pdf"],
  metadata: {
    Author: "Taha Cherfia",
    Title: "Chromiumly",
    Keywords: ["pdf", "html", "gotenberg"],
  },
});
```

Please consider referring to [ExifTool](https://exiftool.org/TagNames/XMP.html#pdf) for a comprehensive list of accessible metadata options.

#### File Generation

It is just a generic complementary method that takes the `buffer` returned by the `convert` method, and a
chosen `filename` to generate the PDF file.

Please note that all the PDF files can be found `__generated__` folder in the root folder of your project.

### PDF Splitting

Each [Chromium](#chromium) and [LibreOffice](#libreoffice) route has a `split` parameter that allows splitting the PDF file into multiple files. The `split` parameter is an object with the following properties:

- `mode`: the mode of the split. It can be `pages` or `intervals`.
- `span`: the span of the split. It is a string that represents the range of pages to split.
- `unify`: a boolean that allows unifying the split files. Only works when `mode` is `pages`.
- `flatten`: a boolean that, when set to true, flattens the split PDF files, making form fields and annotations uneditable.

```typescript
import { UrlConverter } from "chromiumly";
const buffer = await UrlConverter.convert({
  url: "https://www.example.com/",
  split: {
    mode: "pages",
    span: "1-2",
    unify: true,
  },
});
```

On the other hand, PDFEngines' has a `split` method that interacts with [PDF Engines](https://gotenberg.dev/docs/manipulate-pdfs/split-pdfs) split route which splits PDF files into multiple files.

```typescript
import { PDFEngines } from "chromiumly";

const buffer = await PDFEngines.split({
  files: ["path/to/file_1.pdf", "path/to/file_2.pdf"],
  options: {
    mode: "pages",
    span: "1-2",
    unify: true,
  },
});
```

`PDFEngines.split` also accepts optional `watermark`, `stamp`, and `rotate` for the same PDF-engine post-processing as merge.

> ⚠️ **Note**: Gotenberg does not currently validate the `span` value when `mode` is set to `pages`, as the validation depends on the chosen engine for the split feature. See [PDF Engines module configuration](https://gotenberg.dev/docs/configuration#pdf-engines) for more details.

### PDF Flattening

PDF flattening converts interactive elements like forms and annotations into a static PDF. This ensures the document looks the same everywhere and prevents further edits.

```typescript
import { PDFEngines } from "chromiumly";

const buffer = await PDFEngines.flatten({
  files: ["path/to/file_1.pdf", "path/to/file_2.pdf"],
});
```

### PDF Encryption

Each [Chromium](#chromium) and [LibreOffice](#libreoffice) route supports PDF encryption through the `userPassword` and `ownerPassword` parameters. The `userPassword` is required to open the PDF, while the `ownerPassword` provides full access permissions.

```typescript
import { UrlConverter } from "chromiumly";

const buffer = await UrlConverter.convert({
  url: "https://www.example.com/",
  userPassword: "my_user_password",
  ownerPassword: "my_owner_password",
});
```

### Embedding Files

Each [Chromium](#chromium) and [LibreOffice](#libreoffice) route supports embedding files into the generated PDF through the `embeds` parameter. This feature enables the creation of PDFs compatible with standards like [ZUGFeRD / Factur-X](https://fnfe-mpe.org/factur-x/), which require embedding XML invoices and other files within the PDF.

You can embed multiple files by passing an array of file paths, buffers, or read streams:

```typescript
import { HtmlConverter } from "chromiumly";

const htmlConverter = new HtmlConverter();
const buffer = await htmlConverter.convert({
  html: "path/to/index.html",
  embeds: [
    "path/to/invoice.xml",
    "path/to/logo.png",
    Buffer.from("additional data"),
  ],
});
```

All embedded files will be attached to the generated PDF and can be extracted using PDF readers that support file attachments.

### Watermark and stamp

Gotenberg can apply a **watermark** (behind content) and/or **stamp** (on top of content) using the configured PDF engine after the main conversion or PDF operation. Types `PdfEngineWatermark` and `PdfEngineStamp` are exported from `chromiumly` if you want them explicitly in your code. Chromiumly exposes this on:

| API                                                                | What to pass                                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `UrlConverter` / `HtmlConverter` / `MarkdownConverter` `convert()` | `watermark`, `stamp`, `rotate` on the options object (see `ConversionOptions` above) |
| `LibreOffice.convert()`                                            | Native fields (`nativeWatermarkText`, …) and/or `watermark`, `stamp`, `rotate`       |
| `PDFEngines.merge()` / `PDFEngines.split()`                        | Optional `watermark`, `stamp`, `rotate`                                              |
| `PDFEngines.rotate()`                                              | Dedicated endpoint; `files`, `angle` (`90` \| `180` \| `270`), optional `pages`      |
| `PDFEngines.watermark()` / `PDFEngines.stamp()`                    | Dedicated endpoints; `watermark` or `stamp` config is required                       |

For image or PDF sources, set `source` to `image` or `pdf`, set `expression` to the **filename** of the uploaded asset, and pass the file in `file`. Chromium screenshot routes do not document these fields; use HTML/CSS overlays or convert-to-PDF flows instead.

## Snippet

The following is a short snippet of how to use the library.

```typescript
import { PDFEngines, UrlConverter } from "chromiumly";

async function run() {
  const urlConverter = new UrlConverter();
  const buffer = await urlConverter.convert({
    url: "https://gotenberg.dev/",
    properties: {
      singlePage: true,
      size: {
        width: 8.5,
        height: 11,
      },
    },
    emulatedMediaType: "screen",
    emulatedMediaFeatures: [
      { name: "prefers-color-scheme", value: "dark" },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
    failOnHttpStatusCodes: [404],
    failOnConsoleExceptions: true,
    skipNetworkIdleEvent: false,
    optimizeForSpeed: true,
    split: {
      mode: "pages",
      span: "1-2",
      unify: true,
    },
  });

  await PDFEngines.generate("gotenberg.pdf", buffer);
}

run();
```
