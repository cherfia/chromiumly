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

A lightweight TypeScript client for [Gotenberg](https://gotenberg.dev/)’s HTTP API. Use it against your own Gotenberg container or against the **Chromiumly hosted API**—same client, different backend.

|                           | Self‑hosted [Gotenberg](https://github.com/gotenberg/gotenberg)     | [Chromiumly hosted API](https://chromiumly.dev)                                                    |
| :------------------------ | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------- |
| **What it is**            | Official open‑source PDF stack (Docker image)                       | Managed service at [https://api.chromiumly.dev](https://api.chromiumly.dev)                        |
| **What Chromiumly calls** | Documented Gotenberg routes (Chromium, LibreOffice, PDF engines, …) | Those same routes, **plus** [Templates](#templates-hosted-api-only) (not in open‑source Gotenberg) |
| **Configuration**         | `GOTENBERG_ENDPOINT`                                                | `CHROMIUMLY_API_KEY` (no endpoint)                                                                 |

Everything in this README that maps to [gotenberg.dev](https://gotenberg.dev/) applies to **both** backends unless a section says otherwise. **[Templates](#templates-hosted-api-only) are Chromiumly hosted API only**—they are not a Gotenberg feature and do not work with a self‑hosted instance.

## API Key Authentication (Hosted API)

Chromiumly provides a managed API at [https://api.chromiumly.dev](https://api.chromiumly.dev). Hosted API support was introduced in `chromiumly@5.0.0` and is available only in Chromiumly `5.0.0+`. If you prefer not to run Gotenberg yourself, you avoid Docker and server ops. Sign up at [https://chromiumly.dev](https://chromiumly.dev), get an API key, and call the same conversion routes as with self‑hosting. The hosted API also exposes **[Templates](#templates-hosted-api-only)** (invoice PDFs from structured data), which are **not** available on self‑hosted Gotenberg.

When using the hosted API, **you do not need to set `GOTENBERG_ENDPOINT`**. Just provide your API key:

```bash
CHROMIUMLY_API_KEY=your-api-key
```

Once the environment variable is set, Chromiumly will automatically send all requests to the hosted API using your key.

You can also configure the hosted API programmatically without an endpoint:

```typescript
import { Chromiumly } from 'chromiumly';

Chromiumly.configure({
    apiKey: 'your-api-key'
});
```

### Minimal usage example (hosted API)

```typescript
import { UrlConverter } from 'chromiumly';

async function run() {
    const urlConverter = new UrlConverter();

    const buffer = await urlConverter.convert({
        url: 'https://www.example.com/'
    });

    // Write the buffer to disk, send it over HTTP, etc.
}

run();
```

# Table of Contents

1. [API Key Authentication (Hosted API)](#api-key-authentication-hosted-api)
2. [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Configuration](#configuration)
3. [Authentication](#authentication)
    - [Basic Authentication](#basic-authentication)
    - [API Key Authentication](#api-key-authentication)
    - [Advanced Authentication](#advanced-authentication)
4. [Core Features](#core-features)
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
        - [Watermark and stamp (dedicated routes)](#watermark-and-stamp-dedicated-routes)
        - [Metadata Management](#metadata-management)
        - [Bookmarks Management](#bookmarks-management)
        - [Encryption (dedicated route)](#encryption-dedicated-route)
        - [Embedding Files (dedicated route)](#embedding-files-dedicated-route)
        - [Factur-X / ZUGFeRD (dedicated route)](#factur-x--zugferd-dedicated-route)
        - [File Generation](#file-generation)
    - [System](#system)
    - [PDF Splitting](#pdf-splitting)
    - [PDF Flattening](#pdf-flattening)
    - [PDF Encryption](#pdf-encryption)
    - [PDF Permissions](#pdf-permissions)
    - [Embedding Files](#embedding-files)
    - [Factur-X / ZUGFeRD](#factur-x--zugferd)
    - [Output Filename and Request Tracing](#output-filename-and-request-tracing)
    - [Templates (hosted API only)](#templates-hosted-api-only)
    - [Watermark and stamp](#watermark-and-stamp)
5. [Usage Example](#snippet)

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

If you are using the hosted API key option at [https://api.chromiumly.dev](https://api.chromiumly.dev), you **do not need Docker** or a local Gotenberg instance — the service is fully managed for you.

If you prefer to self‑host Gotenberg, be sure you install [Docker](https://www.docker.com/) if you have not already done so.

After that, you can start a default Docker container of [Gotenberg](https://gotenberg.dev/) as follows:

```bash
docker run --rm -p 3000:3000 gotenberg/gotenberg:8
```

### Configuration

Chromiumly supports configurations via both [dotenv](https://www.npmjs.com/package/dotenv)
and [config](https://www.npmjs.com/package/config) configuration libraries or directly via code to add a Gotenberg endpoint to your project when you are **self‑hosting**.

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
import { Chromiumly } from 'chromiumly';

Chromiumly.configure({ endpoint: 'http://localhost:3000' });
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
    endpoint: 'http://localhost:3000',
    username: 'user',
    password: 'pass'
});
```

### API Key Authentication

API key authentication is primarily intended for the **hosted Chromiumly API** at [https://api.chromiumly.dev](https://api.chromiumly.dev). For setup and examples, see [API Key Authentication (Hosted API)](#api-key-authentication-hosted-api). When both API key and basic auth are configured, the API key takes precedence.

### Advanced Authentication

To implement advanced authentication or add custom HTTP headers to your requests, you can use the `customHttpHeaders` option within the `configure` method. This allows you to pass additional headers, such as authentication tokens or custom metadata, with each API call.

For example, you can include a Bearer token for authentication along with a custom header as follows:

```typescript
const token = await generateToken();

Chromiumly.configure({
    endpoint: 'http://localhost:3000',
    customHttpHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Custom-Header': 'value'
    }
});
```

## Core Features

Chromiumly wraps Gotenberg’s HTTP API: classes mirror the routes described in [Gotenberg’s docs](https://gotenberg.dev/docs/getting-started/introduction). Methods that take files accept a path `string`, `Buffer`, or `ReadStream` (e.g. `html`, `header`, `footer`, `markdown`).

The **`Templates`** class is the exception—it talks only to the Chromiumly hosted API and is documented [below](#templates-hosted-api-only).

### Chromium

There are three different classes that come with a single method (i.e.`convert`) which calls one of
Chromium's [conversion routes](https://gotenberg.dev/docs/convert-with-chromium/convert-url-to-pdf) to convert `html` and `markdown` files, or
a `url` to a `buffer` which contains the converted PDF file content.

Similarly, a new set of classes have been added to harness the recently introduced Gotenberg [screenshot routes](https://gotenberg.dev/docs/convert-with-chromium/screenshot-url). These classes include a single method called `capture`, which allows capturing full-page screenshots of `html`, `markdown`, and `url`.

#### URL

```typescript
import { UrlConverter } from 'chromiumly';

const urlConverter = new UrlConverter();
const buffer = await urlConverter.convert({
    url: 'https://www.example.com/'
});
```

```typescript
import { UrlScreenshot } from 'chromiumly';

const screenshot = new UrlScreenshot();
const buffer = await screenshot.capture({
    url: 'https://www.example.com/'
});
```

#### HTML

The only requirement is that the file name should be `index.html`.

```typescript
import { HtmlConverter } from 'chromiumly';

const htmlConverter = new HtmlConverter();
const buffer = await htmlConverter.convert({
    html: 'path/to/index.html'
});
```

```typescript
import { HtmlScreenshot } from 'chromiumly';

const screenshot = new HtmlScreenshot();
const buffer = await screenshot.capture({
    html: 'path/to/index.html'
});
```

#### Markdown

This route accepts an `index.html` file plus a markdown file.

```typescript
import { MarkdownConverter } from 'chromiumly';

const markdownConverter = new MarkdownConverter();
const buffer = await markdownConverter.convert({
    html: 'path/to/index.html',
    markdown: 'path/to/file.md'
});
```

```typescript
import { MarkdownScreenshot } from 'chromiumly';

const screenshot = new MarkdownScreenshot();
const buffer = await screenshot.capture({
    html: 'path/to/index.html',
    markdown: 'path/to/file.md'
});
```

The `markdown` field on the Markdown convert and screenshot routes also accepts an array of distinctly-named files, all referenced from the same `index.html` template:

```typescript
const buffer = await markdownConverter.convert({
    html: 'path/to/index.html',
    markdown: [
        { file: 'path/to/chapter1.md', name: 'chapter1.md' },
        { file: 'path/to/chapter2.md', name: 'chapter2.md' }
    ]
});
```

HTML and Markdown convert/screenshot routes also accept an optional `assets` field for images, stylesheets, or other files referenced from the HTML/markdown content:

```typescript
const buffer = await htmlConverter.convert({
    html: 'path/to/index.html',
    assets: [
        { file: 'path/to/style.css', name: 'style.css' },
        { file: 'path/to/logo.png', name: 'logo.png' }
    ]
});
```

Each `convert()` method takes an optional `properties` parameter of the following type which dictates how the PDF generated
file will look like.

```typescript
type PageProperties = {
    singlePage?: boolean; // Print the entire content in one single page (default false)
    size?: {
        width?: number | string; // Paper width (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 8.5)
        height?: number | string; // Paper height (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 11)
    };
    margins?: {
        top?: number | string; // Top margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
        bottom?: number | string; // Bottom margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
        left?: number | string; // Left margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
        right?: number | string; // Right margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    };
    preferCssPageSize?: boolean; // Define whether to prefer page size as defined by CSS (default false)
    printBackground?: boolean; // Print the background graphics (default false)
    omitBackground?: boolean; // Hide the default white background and allow generating PDFs with transparency (default false)
    landscape?: boolean; // Set the paper orientation to landscape (default false)
    scale?: number; // The scale of the page rendering (default 1.0)
    nativePageRanges?: { from: number; to: number } | string; // Page ranges to print, either a single range or the free-form syntax "1-5, 8, 11-13"
};
```

Every field of `size` and `margins` defaults independently, so you can set just one dimension or margin and let Gotenberg fill in the rest.

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
    /** @deprecated Chromium no longer supports pdfFormat since Gotenberg 8.0.0; use pdfa instead of pdfFormat. */
    pdfFormat?: PdfFormat;
    pdfUA?: boolean; // Enable PDF for Universal Access for optimal accessibility (default false)
    generateTaggedPdf?: boolean; // Embed PDF/UA accessibility structure tags, independent of pdfUA (default false)
    generateDocumentOutline?: boolean; // Generate a document outline / bookmarks from the page's heading tags (default false)
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
    failOnResourceHttpStatusCodes?: number[]; // Return a 409 Conflict response if resource HTTP status code is in the list (default None)
    ignoreResourceHttpStatusDomains?: string[]; // Domains to exclude from resource HTTP status code checks (matches exact domains or subdomains)
    failOnResourceLoadingFailed?: boolean; // Return a 409 Conflict response if resource loading failed (default false)
    skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default true)
    skipNetworkAlmostIdleEvent?: boolean; // Do not wait for Chromium network to be almost idle (default true)
    metadata?: Metadata; // Metadata to be written.
    cookies?: Cookie[]; // Cookies to be written.
    downloadFrom?: DownloadFrom; // Download a file from one or multiple URLs. Each URL must return a Content-Disposition header with a filename parameter.
    webhook?: WebhookOptions; // Request-level webhook headers for async callbacks.
    outputFilename?: string; // Custom filename for the resulting file; Gotenberg appends the extension.
    trace?: string; // Custom request id to identify the request in the logs, overriding the generated UUID.
    split?: ConvertSplit; // Split the PDF file into multiple files.
    flatten?: boolean; // Flatten the resulting PDF document (default false)
    userPassword?: string; // Password for opening the resulting PDF(s).
    ownerPassword?: string; // Password for full access on the resulting PDF(s).
    allowPrinting?: boolean; // Allow printing the document (default true)
    allowCopying?: boolean; // Allow copying content from the document (default true)
    allowModifying?: boolean; // Allow modifying the document (default true)
    allowAnnotating?: boolean; // Allow adding or modifying annotations (default true)
    allowFillingForms?: boolean; // Allow filling in form fields (default true)
    allowAssembling?: boolean; // Allow document assembly, e.g. inserting, deleting, or rotating pages (default true)
    embeds?: PathLikeOrReadStream[]; // Files to embed in the generated PDF.
    embedsMetadata?: EmbedsMetadata; // Per-attachment metadata keyed by filename, for PDF/A-3 and Factur-X compliance.
    watermark?: PdfEngineWatermark; // Optional PDF-engine post-processing watermark (behind page content).
    stamp?: PdfEngineStamp; // Optional PDF-engine post-processing stamp (on top of page content).
    rotate?: PdfEngineRotate; // Optional PDF-engine post-process page rotation.
    facturx?: FacturXOptions; // Turn the resulting PDF into a Factur-X / ZUGFeRD e-invoice.
};
```

```typescript
type DownloadFromEntry = {
    url: string;
    extraHttpHeaders?: Record<string, string>;
    embedded?: boolean; // Legacy flag, prefer field
    field?: 'embedded' | 'watermark' | 'stamp' | '';
};

type DownloadFrom = DownloadFromEntry | DownloadFromEntry[];

type WebhookOptions = {
    webhookUrl?: string; // At least one of webhookUrl or webhookErrorUrl is required.
    /** @deprecated Use webhookEventsUrl instead, together with webhookUrl. */
    webhookErrorUrl?: string;
    webhookMethod?: 'POST' | 'PUT' | 'PATCH';
    webhookErrorMethod?: 'POST' | 'PUT' | 'PATCH';
    webhookExtraHttpHeaders?: Record<string, string>;
    webhookEventsUrl?: string;
};

type EmbedsMetadata = Record<
    string, // filename, matching an entry in `embeds`
    {
        mimeType?: string; // Written to the embedded file stream's /Subtype
        relationship?:
            | 'Source'
            | 'Data'
            | 'Alternative'
            | 'Supplement'
            | 'Unspecified'; // The /AFRelationship value
    }
>;
```

Optional `watermark` and `stamp` use the same multipart field names as [Gotenberg’s PDF-engine watermark/stamp](https://gotenberg.dev/docs/manipulate-pdfs/watermark-pdfs): text, image, or PDF sources, with JSON `options` depending on your configured engine (e.g. pdfcpu). See [Watermark PDFs](https://gotenberg.dev/docs/manipulate-pdfs/watermark-pdfs) and [Stamp PDFs](https://gotenberg.dev/docs/manipulate-pdfs/stamp-pdfs) in the official docs.

```typescript
type PdfEngineWatermark = {
    source?: 'text' | 'image' | 'pdf';
    expression?: string; // Text, or filename of the uploaded asset when source is image or pdf
    pages?: string; // Page ranges (e.g. "1-3"); omit for all pages
    options?: Record<string, unknown>; // Serialized as JSON (engine-specific)
    file?: PathLikeOrReadStream | Buffer; // Required when source is image or pdf
};

type PdfEngineStamp = {
    source?: 'text' | 'image' | 'pdf';
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
    format: 'png' | 'jpeg' | 'webp'; //The image compression format, either "png", "jpeg" or "webp".
    quality?: number; // The compression quality from range 0 to 100 (jpeg only).
    omitBackground?: boolean; // Hide the default white background and allow generating screenshots with transparency.
    width?: number; // The device screen width in pixels (default 800).
    height?: number; // The device screen height in pixels (default 600).
    clip?: boolean; // Define whether to clip the screenshot according to the device dimensions (default false).
    deviceScaleFactor?: number; // The device scale factor, useful for HiDPI screenshots (default 1).
};
```

Furthermore, alongside the customization options offered by `ImageProperties`, the `capture()` method accommodates a variety of parameters to expand the versatility of the screenshot process. Below is a comprehensive overview of all parameters available. Note that screenshots produce an image rather than a PDF, so PDF-only options like `header`/`footer`, `generateDocumentOutline`, `userPassword`/`ownerPassword`, and `embeds` don't apply here.

```typescript
type ScreenshotOptions = {
    properties?: ImageProperties;
    userAgent?: string; // Override the User-Agent header sent by Chromium.
    emulatedMediaType?: EmulatedMediaType;
    emulatedMediaFeatures?: EmulatedMediaFeature[]; // Override CSS media features (e.g., prefers-color-scheme). Default: None.
    waitDelay?: string; // Duration (e.g, '5s') to wait when loading an HTML document before convertion.
    waitForExpression?: string; // JavaScript's expression to wait before converting an HTML document into PDF until it returns true.
    waitForSelector?: string; // CSS selector to wait for before converting an HTML document into PDF until it matches a node.
    extraHttpHeaders?: Record<string, string>;
    failOnHttpStatusCodes?: number[]; // Return a 409 Conflict response if the HTTP status code is in the list (default [499,599])
    failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if there are exceptions in the Chromium console (default false)
    failOnResourceHttpStatusCodes?: number[]; // Return a 409 Conflict response if resource HTTP status code is in the list (default None)
    ignoreResourceHttpStatusDomains?: string[]; // Domains to exclude from resource HTTP status code checks (matches exact domains or subdomains)
    failOnResourceLoadingFailed?: boolean; // Return a 409 Conflict response if resource loading failed (default false)
    skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default true)
    skipNetworkAlmostIdleEvent?: boolean; // Do not wait for Chromium network to be almost idle (default true)
    optimizeForSpeed?: boolean; // Define whether to optimize image encoding for speed, not for resulting size.
    cookies?: Cookie[]; // Cookies to be written.
    downloadFrom?: DownloadFrom; // Download files from one or multiple URLs.
    webhook?: WebhookOptions; // Request-level webhook headers for async callbacks.
    outputFilename?: string; // Custom filename for the resulting file; Gotenberg appends the extension.
    trace?: string; // Custom request id to identify the request in the logs, overriding the generated UUID.
};
```

### LibreOffice

The `LibreOffice` class comes with a single method `convert`. This method interacts with [LibreOffice](https://gotenberg.dev/docs/convert-with-libreoffice/convert-to-pdf) route to convert different documents to PDF files. You can find the file extensions
accepted [here](https://gotenberg.dev/docs/convert-with-libreoffice/convert-to-pdf).

```typescript
import { LibreOffice } from 'chromiumly';

const buffer = await LibreOffice.convert({
    files: [
        'path/to/file.docx',
        'path/to/file.png',
        { data: xlsxFileBuffer, ext: 'xlsx' }
    ]
});
```

Similarly to Chromium's route `convert` method, this method takes an optional `properties` parameter of the following type, which
also includes a `password` field to open the source document:

```typescript
type PageProperties = {
    password?: string; // Password to open the source document
    landscape?: boolean; // Paper orientation landscape (default false)
    nativePageRanges?: { from: number; to: number }; // Page ranges to print
    exportFormFields?: boolean; // Export form fields as interactive widgets, or false to flatten them during conversion (default true)
    singlePageSheets?: boolean; // Render entire spreadsheet as a single page (default false)
    allowDuplicateFieldNames?: boolean; // Allow multiple form fields with the same name
    exportBookmarks?: boolean; // Export bookmarks to the resulting PDF (default true)
    exportBookmarksToPdfDestination?: boolean; // Export bookmarks as Named Destination in the PDF
    exportPlaceholders?: boolean; // Export placeholder fields' visual markings only
    exportNotes?: boolean; // Export notes to the resulting PDF
    exportNotesPages?: boolean; // Export notes pages (Impress documents only)
    exportOnlyNotesPages?: boolean; // Export only notes pages, when exportNotesPages is true
    exportNotesInMargin?: boolean; // Export notes in the margin of the resulting PDF
    convertOooTargetToPdfTarget?: boolean; // Change .od[tpgs] extensions to .pdf in exported links
    exportLinksRelativeFsys?: boolean; // Export file system related hyperlinks as relative
    exportHiddenSlides?: boolean; // Export hidden slides (Impress documents only)
    skipEmptyPages?: boolean; // Suppress the automatic insertion of blank pages (Writer documents only)
    updateIndexes?: boolean; // Update the document's indexes/table of contents before export (default true)
    addOriginalDocumentAsStream?: boolean; // Insert the original file as a stream in the resulting PDF
};
```

In addition to `properties`, the `convert()` method accepts the following optional parameters:

- `pdfa`: PDF format of the conversion resulting file (i.e. `PDF/A-1b`, `PDF/A-2b`, `PDF/A-3b`).
- `pdfUA`: enables PDF for Universal Access for optimal accessibility.
- `merge`: merges all the resulting files from the conversion into an individual PDF file.
- `metadata`: writes metadata to the generated PDF file.
- `losslessImageCompression`: allows turning lossless compression on or off to tweak image conversion performance.
- `reduceImageResolution`: allows turning on or off image resolution reduction to tweak image conversion performance.
- `quality`: specifies the quality of the JPG export. The value ranges from 1 to 100, with higher values producing higher-quality images and larger file sizes.
- `maxImageResolution`: specifies if all images will be reduced to the specified DPI value. Possible values are: `75`, `150`, `300`, `600`, and `1200`.
- `initialView`: initial PDF view mode (`0`: none, `1`: outline, `2`: thumbnails).
- `initialPage`: page number opened by default.
- `magnification`: initial magnification mode (`0`: default, `1`: fit page, `2`: fit width, `3`: fit visible, `4`: explicit zoom).
- `zoom`: initial zoom percentage when `magnification` is `4`.
- `pageLayout`: initial layout (`0`: default, `1`: single page, `2`: one column, `3`: two columns).
- `firstPageOnLeft`: place first page on the left when using two-column layout.
- `resizeWindowToInitialPage`: resize the viewer window to the first page dimensions.
- `centerWindow`: center the PDF viewer window on screen.
- `openInFullScreenMode`: open the PDF in full-screen mode.
- `displayPDFDocumentTitle`: display PDF title in viewer title bar instead of filename.
- `hideViewerMenubar`: hide the viewer menu bar.
- `hideViewerToolbar`: hide the viewer toolbar.
- `hideViewerWindowControls`: hide viewer window controls.
- `useTransitionEffects`: use transition effects for Impress slides.
- `openBookmarkLevels`: number of bookmark levels opened on load (`-1` opens all levels).
- `downloadFrom`: download files remotely (`DownloadFromEntry` or `DownloadFromEntry[]`).
- `split`: split the resulting PDF into multiple files — same shape as Chromium's `split` (`ConvertSplit`, see [PDF Splitting](#pdf-splitting)).
- `flatten`: a boolean that, when set to true, flattens the resulting PDF's form fields and annotations, making them uneditable.
- `userPassword`: password for opening the resulting PDF(s).
- `ownerPassword`: password for full access on the resulting PDF(s).
- `allowPrinting` / `allowCopying` / `allowModifying` / `allowAnnotating` / `allowFillingForms` / `allowAssembling`: PDF permission booleans, each defaulting to `true` — see [PDF Permissions](#pdf-permissions).
- `embeds`: files to embed in the generated PDF (repeatable). This feature enables the creation of PDFs compatible with standards like [ZUGFeRD / Factur-X](https://fnfe-mpe.org/factur-x/), which require embedding XML invoices and other files within the PDF.
- `embedsMetadata`: per-attachment metadata keyed by filename, for PDF/A-3 and Factur-X compliance — see [Embedding Files](#embedding-files).
- `facturx`: turn the resulting PDF into a Factur-X / ZUGFeRD e-invoice — see [Factur-X / ZUGFeRD](#factur-x--zugferd).
- `outputFilename` / `trace`: custom output filename and/or request trace id — see [Output Filename and Request Tracing](#output-filename-and-request-tracing).
- `webhook`: request-level webhook headers for async callbacks.
- **Native LibreOffice watermarks** (applied during export): `nativeWatermarkText`, `nativeWatermarkColor`, `nativeWatermarkFontHeight`, `nativeWatermarkRotateAngle`, `nativeWatermarkFontName`, `nativeTiledWatermarkText` — see [Convert to PDF](https://gotenberg.dev/docs/convert-with-libreoffice/convert-to-pdf).
- **PDF-engine watermark/stamp** (post-processing after conversion): `watermark` and `stamp` — same shapes as in Chromium `ConversionOptions` (`PdfEngineWatermark` / `PdfEngineStamp`). For `{ data, ext }` file objects, use the same pattern as in `files`.
- `rotate`: PDF-engine post-process page rotation — see [PDF Rotation](#pdf-rotation).

### PDF Engines

The `PDFEngines` class interacts with Gotenberg's [PDF Engines](https://gotenberg.dev/docs/manipulate-pdfs/pdfa-pdfua) routes to manipulate PDF files.

Every method below also accepts the optional cross-cutting parameters `downloadFrom`, `webhook`, `outputFilename`, and `trace` (omitted from most examples for brevity). See the `DownloadFrom`/`WebhookOptions` types under [Chromium](#chromium) and [Output Filename and Request Tracing](#output-filename-and-request-tracing).

#### Format Conversion

This method interacts with [PDF Engines](https://gotenberg.dev/docs/manipulate-pdfs/pdfa-pdfua) convertion route to transform PDF files into the requested PDF/A format and/or PDF/UA. At least one of `pdfa` or `pdfUA` must be provided.

```typescript
import { PDFEngines } from 'chromiumly';

const buffer = await PDFEngines.convert({
    files: ['path/to/file_1.pdf', 'path/to/file_2.pdf'],
    pdfa: PdfFormat.A_2b,
    pdfUA: true
});
```

#### Merging

This method interacts with [PDF Engines](https://gotenberg.dev/docs/manipulate-pdfs/merge-pdfs) merge route which gathers different
engines that can manipulate and merge PDF files such
as: [PDFtk](https://gitlab.com/pdftk-java/pdftk), [PDFcpu](https://github.com/pdfcpu/pdfcpu), [QPDF](https://github.com/qpdf/qpdf),
and [UNO](https://github.com/unoconv/unoconv).

```typescript
import { PDFEngines } from 'chromiumly';

const buffer = await PDFEngines.merge({
    files: ['path/to/file_1.pdf', 'path/to/file_2.pdf'],
    pdfa: PdfFormat.A_2b,
    pdfUA: true,
    metadata: { Author: 'Taha Cherfia' },
    flatten: true,
    bookmarks: [{ title: 'Section 1', page: 1 }],
    autoIndexBookmarks: false, // auto-extract and offset each input's existing bookmarks (default false)
    userPassword: 'my_user_password',
    ownerPassword: 'my_owner_password',
    allowPrinting: false
});
```

Optional `metadata` writes metadata to the merged PDF, and `flatten` flattens its form fields and annotations, both matching [Merge PDFs](https://gotenberg.dev/docs/manipulate-pdfs/merge-pdfs) in the Gotenberg docs.

Optional `bookmarks` sets a final bookmark list on the merged PDF, or a filename-keyed map applied to each input before merging (its page indexes get offset automatically). Optional `autoIndexBookmarks` instead auto-extracts and offsets each input's existing bookmarks. `bookmarks` and `autoIndexBookmarks` are mutually exclusive strategies for populating the merged PDF's outline.

Optional `userPassword`/`ownerPassword` and the six permission booleans (`allowPrinting`, `allowCopying`, `allowModifying`, `allowAnnotating`, `allowFillingForms`, `allowAssembling`) encrypt the merged output — see [PDF Encryption](#pdf-encryption) and [PDF Permissions](#pdf-permissions).

Optional `watermark` and `stamp` (`PdfEngineWatermark` / `PdfEngineStamp`) apply PDF-engine post-processing to the merged output, matching [Merge PDFs](https://gotenberg.dev/docs/manipulate-pdfs/merge-pdfs) in the Gotenberg docs.

Optional `rotate` (`{ angle: 90 | 180 | 270; pages?: string }`) rotates pages after merge via the PDF engine; omit `pages` or leave it empty to rotate all pages.

#### PDF Rotation

`PDFEngines.rotate()` calls Gotenberg’s [rotate route](https://gotenberg.dev/docs/manipulate-pdfs/rotate-pdfs) to rotate existing PDFs. The same post-processing is available on `PDFEngines.merge()`, `PDFEngines.split()`, and on Chromium and LibreOffice `convert()` through the optional `rotate` property (Gotenberg generates the PDF, then rotates selected pages—an extra pass).

```typescript
import { PDFEngines } from 'chromiumly';

const rotated = await PDFEngines.rotate({
    files: ['path/to/document.pdf'],
    angle: 90,
    pages: '1-3' // optional; omit for all pages
});
```

#### Watermark and stamp (dedicated routes)

These methods call [`/forms/pdfengines/watermark`](https://gotenberg.dev/docs/manipulate-pdfs/watermark-pdfs) and [`/forms/pdfengines/stamp`](https://gotenberg.dev/docs/manipulate-pdfs/stamp-pdfs).

```typescript
import { PDFEngines } from 'chromiumly';

const watermarked = await PDFEngines.watermark({
    files: ['path/to/document.pdf'],
    watermark: {
        source: 'text',
        expression: 'CONFIDENTIAL',
        options: { opacity: 0.25, rotation: 45 }
    }
});

const stamped = await PDFEngines.stamp({
    files: ['path/to/document.pdf'],
    stamp: {
        source: 'text',
        expression: 'APPROVED',
        options: { opacity: 0.5, rotation: 0 }
    }
});
```

#### Metadata Management

##### readMetadata

This method reads metadata from the provided PDF files.

```typescript
import { PDFEngines } from 'chromiumly';

const metadataBuffer = await PDFEngines.readMetadata({
    files: ['path/to/file_1.pdf'],
    downloadFrom: [{ url: 'https://cdn.example.com/file.pdf' }] // optional: read metadata from a remote PDF
});
```

##### writeMetadata

This method writes metadata to the provided PDF files.

```typescript
import { PDFEngines } from 'chromiumly';

const buffer = await PDFEngines.writeMetadata({
    files: ['path/to/file_1.pdf', 'path/to/file_2.pdf'],
    metadata: {
        Author: 'Taha Cherfia',
        Title: 'Chromiumly',
        Keywords: ['pdf', 'html', 'gotenberg']
    }
});
```

Please consider referring to [ExifTool](https://exiftool.org/TagNames/XMP.html#pdf) for a comprehensive list of accessible metadata options.

#### Bookmarks Management

##### readBookmarks

This method reads bookmarks (outline / table of contents) from the provided PDF files.

```typescript
import { PDFEngines } from 'chromiumly';

const bookmarks = await PDFEngines.readBookmarks([
    'path/to/file_1.pdf',
    'path/to/file_2.pdf'
]);
```

##### writeBookmarks

This method writes bookmarks to the provided PDF files.

```typescript
import { PDFEngines } from 'chromiumly';

const updated = await PDFEngines.writeBookmarks({
    files: ['path/to/file_1.pdf'],
    bookmarks: [
        {
            title: 'Chapter 1',
            page: 1,
            children: []
        }
    ]
});
```

#### Encryption (dedicated route)

`PDFEngines.encrypt()` calls Gotenberg's [encrypt route](https://gotenberg.dev/docs/manipulate-pdfs/encrypt-pdfs) to encrypt existing PDFs directly, without going through a conversion. At least one of `userPassword` or `ownerPassword` is required; since Gotenberg 8.34.0, an owner-password-only request produces an owner-only PDF that opens without a password but still enforces the given permissions.

```typescript
import { PDFEngines } from 'chromiumly';

const encrypted = await PDFEngines.encrypt({
    files: ['path/to/document.pdf'],
    options: {
        userPassword: 'my_user_password',
        ownerPassword: 'my_owner_password',
        allowPrinting: false,
        allowCopying: false
    }
});
```

See [PDF Encryption](#pdf-encryption) and [PDF Permissions](#pdf-permissions) for the full set of encryption and permission fields, also available on Chromium and LibreOffice `convert()`, and on `PDFEngines.merge()`/`PDFEngines.split()`.

#### Embedding Files (dedicated route)

`PDFEngines.embed()` calls Gotenberg's [embed route](https://gotenberg.dev/docs/manipulate-pdfs/attachments) to attach files to existing PDFs directly, without going through a conversion.

```typescript
import { PDFEngines } from 'chromiumly';

const embedded = await PDFEngines.embed({
    files: ['path/to/document.pdf'],
    embeds: ['path/to/invoice.xml', 'path/to/logo.png'],
    embedsMetadata: {
        'invoice.xml': { mimeType: 'text/xml', relationship: 'Data' }
    }
});
```

See [Embedding Files](#embedding-files) for the `embedsMetadata` shape, also available on Chromium and LibreOffice `convert()`.

#### Factur-X / ZUGFeRD (dedicated route)

`PDFEngines.facturX()` calls Gotenberg's [Factur-X route](https://gotenberg.dev/docs/manipulate-pdfs/factur-x) to turn existing PDFs into Factur-X / ZUGFeRD e-invoices directly, without going through a conversion: it embeds the CII invoice XML under the canonical `factur-x.xml` name and converts the PDF to PDF/A-3.

```typescript
import { PDFEngines } from 'chromiumly';

const invoice = await PDFEngines.facturX({
    files: ['path/to/document.pdf'],
    facturx: {
        facturxXml: 'path/to/invoice.xml',
        facturxConformanceLevel: 'EN 16931',
        facturxDocumentType: 'INVOICE', // optional, defaults to 'INVOICE'
        facturxVersion: '1.0' // optional, defaults to '1.0'
    }
});
```

See [Factur-X / ZUGFeRD](#factur-x--zugferd) for the full `facturx` field shape, also available on Chromium and LibreOffice `convert()`.

#### File Generation

It is just a generic complementary method that takes the `buffer` returned by the `convert` method, and a
chosen `filename` to generate the PDF file.

Please note that all the PDF files can be found `__generated__` folder in the root folder of your project.

### PDF Splitting

Each [Chromium](#chromium) and [LibreOffice](#libreoffice) route has a `split` parameter (type `ConvertSplit`) that allows splitting the resulting PDF into multiple files:

- `mode`: the mode of the split. It can be `pages` or `intervals`.
- `span`: the span of the split. It is a string that represents the range of pages to split.
- `unify`: a boolean that allows unifying the split files. Only works when `mode` is `pages`.

Note that `flatten` is a separate top-level parameter on these routes (see [PDF Flattening](#pdf-flattening)), not part of `split` itself.

```typescript
import { UrlConverter } from 'chromiumly';
const buffer = await UrlConverter.convert({
    url: 'https://www.example.com/',
    split: {
        mode: 'pages',
        span: '1-2',
        unify: true
    }
});
```

On the other hand, PDFEngines' has a `split` method that interacts with [PDF Engines](https://gotenberg.dev/docs/manipulate-pdfs/split-pdfs) split route which splits PDF files into multiple files. Here, `options.flatten` is part of the split configuration itself, rather than a separate top-level field:

```typescript
import { PDFEngines } from 'chromiumly';

const buffer = await PDFEngines.split({
    files: ['path/to/file_1.pdf', 'path/to/file_2.pdf'],
    options: {
        mode: 'pages',
        span: '1-2',
        unify: true,
        flatten: true
    },
    metadata: { Author: 'Taha Cherfia' },
    pdfa: PdfFormat.A_2b,
    userPassword: 'my_user_password'
});
```

`PDFEngines.split` also accepts optional `metadata`, `pdfa`/`pdfUA`, `userPassword`/`ownerPassword` and the six permission booleans (see [PDF Permissions](#pdf-permissions)), and `watermark`, `stamp`, and `rotate` for the same PDF-engine post-processing as merge.

> ⚠️ **Note**: Gotenberg does not currently validate the `span` value when `mode` is set to `pages`, as the validation depends on the chosen engine for the split feature. See [PDF Engines module configuration](https://gotenberg.dev/docs/configuration#pdf-engines) for more details.

### PDF Flattening

PDF flattening converts interactive elements like forms and annotations into a static PDF. This ensures the document looks the same everywhere and prevents further edits.

```typescript
import { PDFEngines } from 'chromiumly';

const buffer = await PDFEngines.flatten([
    'path/to/file_1.pdf',
    'path/to/file_2.pdf'
]);
```

### PDF Encryption

Each [Chromium](#chromium) and [LibreOffice](#libreoffice) route, as well as `PDFEngines.merge()` and `PDFEngines.split()`, supports PDF encryption through the `userPassword` and `ownerPassword` parameters. The `userPassword` is required to open the PDF, while the `ownerPassword` provides full access permissions.

```typescript
import { UrlConverter } from 'chromiumly';

const buffer = await UrlConverter.convert({
    url: 'https://www.example.com/',
    userPassword: 'my_user_password',
    ownerPassword: 'my_owner_password'
});
```

There's also a dedicated `PDFEngines.encrypt()` route for encrypting existing PDFs directly — see [Encryption (dedicated route)](#encryption-dedicated-route). Unlike the routes above, it requires at least one of `userPassword` or `ownerPassword`, and (since Gotenberg 8.34.0) allows an owner-password-only PDF that opens without a password but still enforces permissions.

### PDF Permissions

Each route in [PDF Encryption](#pdf-encryption) above also accepts six permission booleans, all defaulting to `true`:

```typescript
type PdfEnginePermissions = {
    allowPrinting?: boolean; // Allow printing the document
    allowCopying?: boolean; // Allow copying content from the document
    allowModifying?: boolean; // Allow modifying the document
    allowAnnotating?: boolean; // Allow adding or modifying annotations
    allowFillingForms?: boolean; // Allow filling in form fields
    allowAssembling?: boolean; // Allow document assembly, e.g. inserting, deleting, or rotating pages
};
```

```typescript
import { UrlConverter } from 'chromiumly';

const buffer = await UrlConverter.convert({
    url: 'https://www.example.com/',
    ownerPassword: 'my_owner_password',
    allowPrinting: false,
    allowCopying: false
});
```

Permission enforcement depends on the active PDF engine: QPDF honors each permission individually, pdfcpu restricts all permissions if any one is denied, and PDFtk supports neither owner-only encryption nor permission restrictions. Restrictions are advisory: PDF viewers honor them, but they aren't cryptographically enforced once the document opens.

### Embedding Files

Each [Chromium](#chromium) and [LibreOffice](#libreoffice) route supports embedding files into the generated PDF through the `embeds` parameter. This feature enables the creation of PDFs compatible with standards like [ZUGFeRD / Factur-X](https://fnfe-mpe.org/factur-x/), which require embedding XML invoices and other files within the PDF.

You can embed multiple files by passing an array of file paths, buffers, or read streams:

```typescript
import { HtmlConverter } from 'chromiumly';

const htmlConverter = new HtmlConverter();
const buffer = await htmlConverter.convert({
    html: 'path/to/index.html',
    embeds: [
        'path/to/invoice.xml',
        'path/to/logo.png',
        Buffer.from('additional data')
    ]
});
```

All embedded files will be attached to the generated PDF and can be extracted using PDF readers that support file attachments.

Optional `embedsMetadata` sets per-attachment metadata, keyed by filename, required for PDF/A-3 and Factur-X compliance:

```typescript
type EmbedsMetadata = Record<
    string, // filename, matching an entry in `embeds`
    {
        mimeType?: string; // Written to the embedded file stream's /Subtype
        relationship?:
            | 'Source'
            | 'Data'
            | 'Alternative'
            | 'Supplement'
            | 'Unspecified'; // The /AFRelationship value
    }
>;
```

```typescript
const buffer = await htmlConverter.convert({
    html: 'path/to/index.html',
    embeds: ['path/to/invoice.xml'],
    embedsMetadata: {
        'invoice.xml': { mimeType: 'text/xml', relationship: 'Data' }
    }
});
```

There's also a dedicated `PDFEngines.embed()` route for attaching files to existing PDFs directly — see [Embedding Files (dedicated route)](#embedding-files-dedicated-route).

### Factur-X / ZUGFeRD

Each [Chromium](#chromium) and [LibreOffice](#libreoffice) route supports turning the resulting PDF into a [Factur-X / ZUGFeRD](https://fnfe-mpe.org/factur-x/) e-invoice through the `facturx` parameter, which embeds the CII invoice XML under the canonical `factur-x.xml` name and converts the PDF to PDF/A-3:

```typescript
type FacturXOptions = {
    facturxXml: PathLikeOrReadStream; // The Factur-X CII invoice XML; embedded as factur-x.xml regardless of the given filename.
    facturxConformanceLevel:
        | 'MINIMUM'
        | 'BASIC WL'
        | 'BASIC'
        | 'EN 16931'
        | 'EXTENDED'
        | 'XRECHNUNG';
    facturxDocumentType?: 'INVOICE' | 'ORDER' | 'ORDER_RESPONSE' | 'ORDER_CHANGE'; // Defaults to 'INVOICE'.
    facturxVersion?: string; // Defaults to '1.0'.
    pdfa?: 'PDF/A-3a' | 'PDF/A-3b' | 'PDF/A-3u';
    pdfUA?: boolean;
};
```

```typescript
import { HtmlConverter } from 'chromiumly';

const htmlConverter = new HtmlConverter();
const buffer = await htmlConverter.convert({
    html: 'path/to/index.html',
    facturx: {
        facturxXml: 'path/to/invoice.xml',
        facturxConformanceLevel: 'EN 16931'
    }
});
```

There's also a dedicated `PDFEngines.facturX()` route for turning existing PDFs into Factur-X e-invoices directly — see [Factur-X / ZUGFeRD (dedicated route)](#factur-x--zugferd-dedicated-route).

### Output Filename and Request Tracing

Every route accepts optional `outputFilename` and `trace` parameters, mapping to the `Gotenberg-Output-Filename` and `Gotenberg-Trace` request headers:

```typescript
type OutputOptions = {
    outputFilename?: string; // Custom filename for the resulting file; Gotenberg appends the extension.
    trace?: string; // Custom request id to identify the request in the logs, overriding the generated UUID.
};
```

```typescript
import { UrlConverter } from 'chromiumly';

const buffer = await UrlConverter.convert({
    url: 'https://www.example.com/',
    outputFilename: 'my-document',
    trace: 'my-correlation-id'
});
```

The [System](#system) routes accept `trace` too (there's no resulting file, so no `outputFilename`):

```typescript
import { System } from 'chromiumly';

const health = await System.getHealth('my-correlation-id');
```

### Templates (hosted API only)

The `Templates` class is **not** part of open‑source Gotenberg. It generates PDFs from structured payloads on the Chromiumly hosted API and **requires `CHROMIUMLY_API_KEY`**. Hosted API features (including `Templates`) were introduced in `chromiumly@5.0.0` and require Chromiumly `5.0.0+`—pointing Chromiumly at `GOTENBERG_ENDPOINT` (self‑hosted Gotenberg) will not enable this feature.

The following template types are currently available:

| Type                 | Description        |
| -------------------- | ------------------ |
| `invoice_saas`       | SaaS-style invoice |
| `invoice_freelancer` | Freelancer invoice |
| `invoice_classic`    | Classic invoice    |
| `invoice_minimal`    | Minimal invoice    |
| `invoice_modern`     | Modern invoice     |

#### Basic Usage

```typescript
import { Templates } from 'chromiumly';

const templates = new Templates();
const buffer = await templates.generate({
    type: 'invoice_saas',
    data: {
        invoiceNumber: 'INV-319',
        createdDate: '2026-03-19',
        dueDate: '2026-04-02',
        companyLogo: 'https://cdn.acmecloud.com/assets/logo-mark.png',
        sender: {
            name: 'Acme Cloud LLC',
            addressLine1: '450 Madison Ave',
            addressLine2: 'New York, NY 10022'
        },
        receiver: {
            name: 'Northwind Health Inc.',
            addressLine1: '221 Harbor Blvd',
            addressLine2: 'San Diego, CA 92101'
        },
        items: [
            {
                description: 'Platform Subscription (Annual)',
                qty: 1,
                unitPrice: '1500.00',
                amount: '1500.00'
            },
            {
                description: 'Onboarding',
                qty: 1,
                unitPrice: '300.00',
                amount: '300.00'
            }
        ],
        currency: 'USD',
        subTotal: '1800.00',
        taxRate: 8.25,
        taxAmount: '148.50',
        total: '1948.50',
        footerNote: 'Payment due in 14 days.',
        footerDisclaimer: 'Late fees may apply.'
    }
});
```

#### Payload Validation

Pass `{ validate: true }` to run runtime validation on the data before sending the request. An error is thrown if the payload does not match the expected structure for the given template type.

```typescript
const buffer = await templates.generate(request, { validate: true });
```

#### Payload Shape

```typescript
type TemplateRequest<TType extends TemplateType> = {
    type: TType;
    data: TemplateDataByType[TType];
};

interface InvoiceSaasTemplateData {
    invoiceNumber: string;
    createdDate: string;
    dueDate: string;
    companyLogo?: string;
    sender: TemplateParty;
    receiver: TemplateParty;
    items: InvoiceItem[];
    currency: Currency;
    subTotal: string;
    taxRate: number;
    taxAmount: string;
    total: string;
    footerNote: string;
    footerDisclaimer?: string;
}

// invoice_classic uses this variant instead, where companyLogo is required.
interface InvoiceClassicTemplateData
    extends Omit<InvoiceSaasTemplateData, 'companyLogo'> {
    companyLogo: string;
}

interface TemplateParty {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    tax?: string;
    iban?: string;
    bic?: string;
}

interface InvoiceItem {
    description: string;
    qty: number;
    unitPrice: string;
    amount: string;
}
```

`invoice_saas`, `invoice_freelancer`, `invoice_minimal`, and `invoice_modern` all use `InvoiceSaasTemplateData`; `invoice_classic` uses `InvoiceClassicTemplateData`, the only variant where `companyLogo` is required.

The `currency` field accepts any [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code exported as the `Currency` type (e.g. `"USD"`, `"EUR"`, `"GBP"`).

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

### System

The `System` class exposes Gotenberg system endpoints. Every method accepts an optional `trace` argument (custom request id, mapped to the `Gotenberg-Trace` header — see [Output Filename and Request Tracing](#output-filename-and-request-tracing)):

```typescript
import { System } from 'chromiumly';

const health = await System.getHealth(); // GET /health
const heartbeat = await System.headHealth(); // HEAD /health
const version = await System.getVersion(); // GET /version
const debug = await System.getDebug(); // GET /debug
const metrics = await System.getPrometheusMetrics(); // GET /prometheus/metrics
const tracedHealth = await System.getHealth('my-correlation-id');
```

## Snippet

The following is a short snippet of how to use the library.

```typescript
import { PDFEngines, UrlConverter } from 'chromiumly';

async function run() {
    const urlConverter = new UrlConverter();
    const buffer = await urlConverter.convert({
        url: 'https://gotenberg.dev/',
        properties: {
            singlePage: true,
            size: {
                width: 8.5,
                height: 11
            }
        },
        emulatedMediaType: 'screen',
        emulatedMediaFeatures: [
            { name: 'prefers-color-scheme', value: 'dark' },
            { name: 'prefers-reduced-motion', value: 'reduce' }
        ],
        failOnHttpStatusCodes: [404],
        failOnConsoleExceptions: true,
        skipNetworkIdleEvent: false,
        skipNetworkAlmostIdleEvent: false,
        split: {
            mode: 'pages',
            span: '1-2',
            unify: true
        }
    });

    await PDFEngines.generate('gotenberg.pdf', buffer);
}

run();
```
