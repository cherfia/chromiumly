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

|                           | Self‑hosted [Gotenberg](https://github.com/gotenberg/gotenberg) | [Chromiumly hosted API](https://chromiumly.dev)                                                    |
| :------------------------ | :-------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **What it is**            | Official open‑source PDF stack (Docker image)                   | Managed service at [https://api.chromiumly.dev](https://api.chromiumly.dev)                        |
| **What Chromiumly calls** | Documented Gotenberg routes (Chromium, LibreOffice, PDF, …)     | Those same routes, **plus** [Templates](#templates-hosted-api-only) (not in open‑source Gotenberg) |
| **Configuration**         | `GOTENBERG_ENDPOINT`                                            | `CHROMIUMLY_API_KEY` (no endpoint)                                                                 |

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
2. [Gotenberg Compatibility](#gotenberg-compatibility)
3. [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Configuration](#configuration)
4. [Authentication](#authentication)
    - [Basic Authentication](#basic-authentication)
    - [API Key Authentication](#api-key-authentication)
    - [Advanced Authentication](#advanced-authentication)
5. [Core Features](#core-features)
    - [Chromium](#chromium)
        - [URL](#url)
        - [HTML](#html)
        - [Markdown](#markdown)
        - [Screenshot](#screenshot)
    - [LibreOffice](#libreoffice)
    - [Stages](#stages)
    - [PDF](#pdf)
        - [Single-stage routes](#single-stage-routes)
        - [Read routes](#read-routes)
        - [File Generation](#file-generation)
    - [Files, Archives and Downloads](#files-archives-and-downloads)
    - [Webhooks](#webhooks)
    - [Output Filename and Request Tracing](#output-filename-and-request-tracing)
    - [Templates (hosted API only)](#templates-hosted-api-only)
    - [System](#system)
6. [Migrating from Chromiumly 6](#migrating-from-chromiumly-6)
7. [Usage Example](#snippet)

## Gotenberg Compatibility

| Chromiumly | Gotenberg |
| :--------- | :-------- |
| `7.x`      | `9.x`     |
| `6.x`      | `8.x`     |

Gotenberg 9 renamed most fields, moved post-processing into ordered [stages](#stages), and replaced the `/forms/pdfengines` routes with `/forms/pdf`. Its requests and Gotenberg 8's are not interchangeable, so pick the Chromiumly major that matches your Gotenberg image. Moving from Chromiumly 6? See [Migrating from Chromiumly 6](#migrating-from-chromiumly-6).

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
docker run --rm -p 3000:3000 gotenberg/gotenberg:9
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
gotenberg/gotenberg:9 gotenberg --api-enable-basic-auth

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

Chromiumly wraps Gotenberg’s HTTP API: classes mirror the routes described in [Gotenberg’s docs](https://gotenberg.dev/docs/getting-started/routes). Methods that take files accept a path `string`, `Buffer`, or `ReadStream` (e.g. `html`, `header`, `footer`, `markdown`).

The **`Templates`** class is the exception—it talks only to the Chromiumly hosted API and is documented [below](#templates-hosted-api-only).

### Chromium

There are three different classes that come with a single method (i.e.`convert`) which calls one of
Chromium's [conversion routes](https://gotenberg.dev/docs/chromium/convert-url) to convert `html` and `markdown` files, or
a `url` to a `buffer` which contains the converted PDF file content.

A matching set of classes wraps Gotenberg's [screenshot routes](https://gotenberg.dev/docs/chromium/screenshot-url). These classes include a single method called `capture`, which allows capturing full-page screenshots of `html`, `markdown`, and `url`.

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
    paperSize?:
        'A3' | 'A4' | 'A5' | 'B4' | 'B5' | 'Letter' | 'Legal' | 'Tabloid'; // Named paper size (default Letter)
    size?: {
        width?: number | string; // Overrides the width paperSize sets (number in inches or string with units)
        height?: number | string; // Overrides the height paperSize sets (number in inches or string with units)
    };
    margins?: {
        top?: number | string; // Top margin (number in inches or string with units, default 0.39)
        bottom?: number | string; // Bottom margin (number in inches or string with units, default 0.39)
        left?: number | string; // Left margin (number in inches or string with units, default 0.39)
        right?: number | string; // Right margin (number in inches or string with units, default 0.39)
    };
    preferCssPageSize?: boolean; // Define whether to prefer page size as defined by CSS (default false)
    printBackground?: boolean; // Print the background graphics (default false)
    omitBackground?: boolean; // Hide the default white background and allow generating PDFs with transparency (default false)
    landscape?: boolean; // Set the paper orientation to landscape (default false)
    scale?: number; // The scale of the page rendering (default 1.0)
    nativePages?: { from: number; to: number } | string; // Pages to print, either a single range or the free-form syntax "1-5, 8, 11-13"
};
```

Every field of `size` and `margins` defaults independently, so you can set just one dimension or margin and let Gotenberg fill in the rest.

**Page Size and Margins Units**

Both `size` and `margins` properties support two formats:

1. **Numeric values** (in inches).
2. **String values with units**:
    - `pt` (points): e.g., `"72pt"`
    - `px` (pixels): e.g., `"96px"`
    - `in` (inches): e.g., `"1in"`
    - `mm` (millimeters): e.g., `"25.4mm"`
    - `cm` (centimeters): e.g., `"2.54cm"`
    - `pc` (picas): e.g., `"6pc"`

```typescript
// A named paper size
properties: { paperSize: 'A4', landscape: true }

// Using string values with units
properties: {
  size: { width: "210mm", height: "297mm" },
  margins: { top: "1cm", bottom: "1cm", left: "2cm", right: "2cm" }
}
```

In addition to `properties`, the `convert()` method accepts the following parameters:

```typescript
type ConversionOptions = {
    properties?: PageProperties; // Customize the appearance of the generated PDF
    header?: PathLikeOrReadStream; // Specify a custom header for the PDF
    footer?: PathLikeOrReadStream; // Specify a custom footer for the PDF
    nativeBookmarks?: boolean; // Build bookmarks from the headings; implies nativeTaggedPdf (default false)
    nativeTaggedPdf?: boolean; // Write a tagged PDF, whose structure screen readers follow (default false)
    stages?: Stage[]; // Post-processing to run on the printed PDF, in order — see Stages
    userAgent?: string; // Customize the user agent string sent during conversion
    emulatedMediaType?: 'screen' | 'print'; // Specify the emulated media type for conversion
    emulatedMediaFeatures?: Record<string, string>; // CSS media features the page sees, e.g. { 'prefers-color-scheme': 'dark' }
    waitDelay?: string; // Duration (e.g., '5s') to wait once the page loads, before printing
    waitForExpression?: string; // JavaScript expression to wait for until it returns true
    waitForSelector?: string; // CSS selector to wait for until a matching element is visible
    waitForWindowStatus?: string; // Wait until window.status equals this value
    extraHttpHeaders?: Record<string, string>; // Headers Chromium sends; end a value with ';scope=<regex>' to scope it
    failOnHttpStatusCodes?: number[]; // List of HTTP status codes triggering a 409 Conflict response (default [499, 599])
    failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if the page throws an exception (default false)
    failOnConsoleMessageTypes?: (
        'log' | 'debug' | 'info' | 'warning' | 'error' | 'assert'
    )[]; // Return a 409 when the page writes one of these console types
    failOnResourceHttpStatusCodes?: number[]; // Return a 409 Conflict response if a resource's HTTP status code is in the list
    ignoreResourceHttpStatusDomains?: string[]; // Domains to exclude from resource HTTP status code checks (matches exact domains or subdomains)
    failOnResourceLoadingFailed?: boolean; // Return a 409 Conflict response if resource loading failed (default false)
    skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default true)
    skipNetworkAlmostIdleEvent?: boolean; // Do not wait for Chromium network to be almost idle (default true)
    cookies?: Cookie[]; // Cookies to set before loading
    archives?: PathLikeOrReadStream[]; // ZIP files Gotenberg unpacks — see Files, Archives and Downloads
    downloadFrom?: DownloadFrom; // URLs Gotenberg downloads first — see Files, Archives and Downloads
    webhook?: WebhookOptions; // Deliver the result to a webhook — see Webhooks
    outputFilename?: string; // Custom filename for the resulting file; Gotenberg appends the extension
    trace?: string; // Custom request id to identify the request in the logs
};
```

Chromium no longer makes PDF/A on its own, nor encrypts, merges, splits, watermarks or writes metadata: add the matching [stage](#stages).

```typescript
const buffer = await htmlConverter.convert({
    html: 'path/to/index.html',
    nativeBookmarks: true,
    stages: [
        { op: 'set-metadata', title: 'Quarterly report', author: 'Finance' },
        { op: 'remediate', profile: ['PDF/A-2b', 'PDF/UA-1'] }
    ]
});
```

#### Screenshot

The `capture()` method takes an optional `properties` parameter of the specified type, influencing the appearance of the captured screenshot file.

```typescript
type ImageProperties = {
    format: 'png' | 'jpeg' | 'webp'; // The image compression format, either "png", "jpeg" or "webp".
    quality?: number; // The compression quality from range 1 to 100 (jpeg only).
    omitBackground?: boolean; // Hide the default white background and allow generating screenshots with transparency.
    width?: number; // The device screen width in pixels (default 800).
    height?: number; // The device screen height in pixels (default 600).
    clip?: boolean; // Define whether to clip the screenshot according to the device dimensions (default false).
    selector?: string; // Capture the first element matching this CSS selector, over clip.
    deviceScaleFactor?: number; // The device scale factor, useful for HiDPI screenshots (default 1).
};
```

`capture()` also takes `optimizeForSpeed` and the same Chromium options as `convert()` — waits, cookies, `failOn*` checks, `archives`, `downloadFrom`, `webhook`, `outputFilename` and `trace`. Screenshots produce an image rather than a PDF, so `header`/`footer`, the `native*` fields and `stages` don't apply.

### LibreOffice

The `LibreOffice` class comes with a single method `convert`. This method interacts with the [LibreOffice](https://gotenberg.dev/docs/libreoffice/convert) route to convert different documents to PDF files. You can find the file extensions
accepted [here](https://gotenberg.dev/docs/libreoffice/convert).

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

Similarly to Chromium's route `convert` method, this method takes an optional `properties` parameter of the following type:

```typescript
type PageProperties = {
    password?: string; // Password to open the source document
    paperSize?:
        'A3' | 'A4' | 'A5' | 'B4' | 'B5' | 'Letter' | 'Legal' | 'Tabloid'; // Paper size for every page; without it, each document keeps its own
    paperWidth?: number | string; // Overrides the width paperSize sets
    paperHeight?: number | string; // Overrides the height paperSize sets
    landscape?: boolean; // Paper orientation landscape (default false)
    nativePages?: { from: number; to: number } | string; // Pages to export, e.g. { from: 1, to: 4 } or "1,3,5-7"
    exportFormFields?: boolean; // Export form fields as fields a reader can fill (default true)
    singlePage?: boolean; // Put each sheet of a spreadsheet on one page (default false)
    allowDuplicateFieldNames?: boolean; // Allow multiple form fields with the same name
    nativeBookmarks?: boolean; // Export bookmarks built from the headings (default true)
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

- `nativePdfa`: export PDF/A at conversion time (`PDF/A-1b`, `PDF/A-2b`, `PDF/A-3b` or `PDF/A-4`). The `remediate` stage reaches the other levels.
- `nativePdfua`: export PDF/UA (`PDF/UA-1`).
- `nativeTaggedPdf`: write a tagged PDF without declaring PDF/UA.
- `nativeQuality`: the JPEG quality of the images, from 1 to 100.
- `nativeLosslessImageCompression`: compress images losslessly instead of as JPEG.
- `nativeReduceImageResolution` / `nativeMaxImageResolution`: downsample images to `75`, `150`, `300`, `600` or `1200` DPI.
- `initialView`: the side panel a viewer opens (`default`, `outline` or `thumbnails`).
- `initialPage`: page number opened by default.
- `magnification`: how a viewer fits the page (`default`, `fitWindow`, `fitWidth`, `fitVisible` or `zoom`).
- `zoom`: zoom percentage when `magnification` is `zoom`.
- `pageLayout`: how a viewer lays the pages out (`default`, `singlePage`, `oneColumn` or `twoColumnRight`).
- `resizeWindowToInitialPage`, `centerWindow`, `openInFullScreenMode`, `displayPDFDocumentTitle`, `hideViewerMenubar`, `hideViewerToolbar`, `hideViewerWindowControls`, `useTransitionEffects`, `openBookmarkLevels`: viewer preferences.
- **Native watermarks** (drawn during export): `nativeWatermarkText` or `nativeTiledWatermarkText`, with `nativeWatermarkColor` (`#rrggbb`), `nativeWatermarkFontSize`, `nativeWatermarkRotation` (degrees, counter-clockwise) and `nativeWatermarkFont`.
- `stages`: post-processing to run on the exported PDFs, in order — see [Stages](#stages). `{ op: 'merge' }` joins the documents into one PDF.
- `archives` / `downloadFrom`: see [Files, Archives and Downloads](#files-archives-and-downloads).
- `webhook`: see [Webhooks](#webhooks).
- `outputFilename` / `trace`: see [Output Filename and Request Tracing](#output-filename-and-request-tracing).

```typescript
const buffer = await LibreOffice.convert({
    files: ['path/to/annex.docx', 'path/to/report.docx'],
    nativePdfa: 'PDF/A-2b',
    stages: [{ op: 'merge' }, { op: 'remediate', profile: 'PDF/A-2b' }]
});
```

### Stages

A stage is one operation on a PDF: merge, stamp, sign, make PDF/A, and so on. Gotenberg runs them in the order you list them, each on what the previous one produced. The Chromium `convert()` methods, `LibreOffice.convert()` and `PDF.pipe()` take a `stages` list; every stage is a typed object discriminated by its `op`, with the option names Gotenberg documents:

| Stage                                      | Does                                                                                    |
| :----------------------------------------- | :-------------------------------------------------------------------------------------- |
| `merge`                                    | Appends the PDFs into one, in the alphanumeric order of their names                     |
| `split`                                    | Cuts each PDF `every` n pages, or into `ranges`; the parts come back in a ZIP           |
| `select` / `delete`                        | Keeps or removes `pages`                                                                |
| `insert`                                   | Inserts the pages of another PDF (`source`) after page `at`                             |
| `compose`                                  | Draws pages on new pages of a chosen size: labels, packing slips, n-up sheets           |
| `rotate`                                   | Turns `pages` by `angle`, a multiple of 90                                              |
| `stamp-text` / `stamp-image` / `stamp-pdf` | Draws text, a PNG/JPEG `image`, or a page of a `source` PDF over pages                  |
| `set-metadata` / `set-bookmarks`           | Writes the document information, or replaces the bookmarks                              |
| `set-form` / `flatten-form`                | Fills form fields, or burns them into the pages                                         |
| `flatten-transparency` / `convert-colors`  | Replaces transparency; converts every color to `cmyk`, `rgb`, `gray` or `output-intent` |
| `redact`                                   | Removes the content under each region from the file itself                              |
| `autotag`                                  | Infers a structure tree for an untagged PDF                                             |
| `attach` / `detach`                        | Embeds a `file`, or removes an embedded file by `name`                                  |
| `optimize`                                 | Shrinks the PDF without lowering image quality                                          |
| `encrypt` / `decrypt`                      | Protects with passwords and `permissions`, or removes the encryption                    |
| `remediate`                                | Repairs the PDF until it conforms to a PDF/A, PDF/UA or `Factur-X` profile              |
| `sign` / `timestamp`                       | Signs with an uploaded `certificate` (PAdES optional), or adds an RFC 3161 timestamp    |
| `render`                                   | Draws pages as PNG or JPEG images                                                       |
| `extract-attachments` / `extract-text`     | Returns the embedded files, or the text, next to the PDF                                |

Options of type _pages_ take Gotenberg's [page selections](https://gotenberg.dev/docs/pdf/pipe#page-selections): `3`, `2-5`, `3-`, `odd`, `even`, `last`, `!1`, comma-separated. Gotenberg checks the [order rules](https://gotenberg.dev/docs/pdf/pipe#order-rules) — `decrypt` first, `render` and the extracts last, at most one `remediate`, `encrypt`, `sign` and `timestamp` — and answers 400 with the broken rule.

**Files a stage needs.** An option that names a file (`insert.source`, `stamp-image.image`, `stamp-pdf.source`, `attach.file`, `remediate.xml`, `sign.certificate`, `sign.key`, `compose.placements[].source`) takes a `StageFile`. Chromiumly uploads it with the request and puts its name in the stage:

```typescript
type StageFile =
    | string // a path, uploaded under its base name
    | URL // a file: URL, uploaded under its base name
    | { file: PathLikeOrReadStream; name: string } // a path, Buffer or ReadStream, uploaded under `name`
    | { name: string }; // a file the request already carries, through downloadFrom, archives or another upload
```

```typescript
import { HtmlConverter } from 'chromiumly';

const buffer = await new HtmlConverter().convert({
    html: 'path/to/invoice.html',
    stages: [
        {
            op: 'stamp-image',
            image: 'path/to/paid.png',
            x: 400,
            y: 700,
            width: 120
        },
        {
            op: 'remediate',
            profile: 'Factur-X',
            xml: { file: invoiceXmlBuffer, name: 'factur-x.xml' },
            level: 'EN 16931'
        },
        {
            op: 'sign',
            certificate: 'path/to/company.p12',
            certificatePassword: 'secret',
            pades: true
        }
    ]
});
```

Every stage type is exported (`Stage`, `StampTextStage`, `RemediateStage`, …), as are `StageFile`, `PageSelection`, `Bookmark` and the profile unions.

### PDF

The `PDF` class wraps Gotenberg's [`/forms/pdf`](https://gotenberg.dev/docs/pdf/pipe) routes. `PDF.pipe()` runs a list of stages on the PDFs you send:

```typescript
import { PDF } from 'chromiumly';

const buffer = await PDF.pipe({
    files: ['path/to/report.pdf'],
    stages: [
        { op: 'select', pages: '1-2' },
        { op: 'stamp-text', text: 'DRAFT', x: 72, y: 72, fontSize: 24 },
        { op: 'optimize' }
    ]
});
```

Every method also takes `files`, `archives`, `downloadFrom`, `webhook`, `outputFilename` and `trace`. `files` accepts `.pdf` paths, `Buffer`s or `ReadStream`s, and may be left out when `archives` or `downloadFrom` bring the PDFs. Gotenberg takes the PDFs in the alphanumeric order of their names, so name them after the order you want.

#### Single-stage routes

Each stage also has its own route, with its own method. The options are the stage's, without `op`:

| Method                                               | Route                                                    |
| :--------------------------------------------------- | :------------------------------------------------------- |
| `PDF.merge()`                                        | `/forms/pdf/merge`                                       |
| `PDF.split()`                                        | `/forms/pdf/split`                                       |
| `PDF.select()` / `PDF.delete()` / `PDF.insert()`     | `/forms/pdf/select`, `/delete`, `/insert`                |
| `PDF.compose()` / `PDF.rotate()`                     | `/forms/pdf/compose`, `/rotate`                          |
| `PDF.stampText()` / `stampImage()` / `stampPdf()`    | `/forms/pdf/stamp-text`, `/stamp-image`, `/stamp-pdf`    |
| `PDF.setMetadata()` / `setBookmarks()` / `setForm()` | `/forms/pdf/set-metadata`, `/set-bookmarks`, `/set-form` |
| `PDF.flattenForm()` / `flattenTransparency()`        | `/forms/pdf/flatten-form`, `/flatten-transparency`       |
| `PDF.convertColors()` / `redact()` / `autotag()`     | `/forms/pdf/convert-colors`, `/redact`, `/autotag`       |
| `PDF.attach()` / `detach()` / `extractAttachments()` | `/forms/pdf/attach`, `/detach`, `/extract-attachments`   |
| `PDF.extractText()` / `optimize()`                   | `/forms/pdf/extract-text`, `/optimize`                   |
| `PDF.encrypt()` / `decrypt()` / `remediate()`        | `/forms/pdf/encrypt`, `/decrypt`, `/remediate`           |
| `PDF.sign()` / `timestamp()` / `render()`            | `/forms/pdf/sign`, `/timestamp`, `/render`               |

```typescript
const merged = await PDF.merge({
    files: ['path/to/1-cover.pdf', 'path/to/2-body.pdf']
});

const parts = await PDF.split({
    files: ['path/to/report.pdf'],
    ranges: ['1', '2-3']
}); // a ZIP

const protectedPdf = await PDF.encrypt({
    files: ['path/to/report.pdf'],
    userPassword: 'open-me',
    ownerPassword: 'admin',
    permissions: { print: false, extractText: false }
});

const invoice = await PDF.remediate({
    files: ['path/to/invoice.pdf'],
    profile: 'Factur-X',
    xml: 'path/to/factur-x.xml',
    level: 'EN 16931'
});

const thumbnails = await PDF.render({
    files: ['path/to/report.pdf'],
    pages: '1',
    dpi: 72,
    format: 'jpeg',
    quality: 80
});
```

#### Read routes

The read routes answer JSON, which Chromiumly parses and types: one entry per PDF, under its file name. They take `files`, `archives`, `downloadFrom`, an optional `password` for encrypted PDFs, and `trace`; they don't take a webhook or an output filename.

```typescript
const info = await PDF.info({ files: ['path/to/report.pdf'] });
// { 'report.pdf': { pages: 3, version: '1.7', encrypted: false, tagged: false, linearized: false, formFields: false } }

const metadata = await PDF.metadata({ files: ['path/to/report.pdf'] }); // title, author, …, creationDate, modDate
const bookmarks = await PDF.bookmarks({ files: ['path/to/report.pdf'] }); // { title, pageNumber, children? }[]
const attachments = await PDF.attachments({ files: ['path/to/invoice.pdf'] }); // { name, mimeType?, relationship? }[]
const form = await PDF.form({ files: ['path/to/form.pdf'], pages: '2' }); // the fields set-form fills
const validation = await PDF.validate({
    files: ['path/to/archive.pdf'],
    profile: ['PDF/A-2b', 'PDF/UA-1']
}); // { profile, compliant, violations }
```

#### File Generation

`PDF.generate()` writes a buffer to the `__generated__` directory under the current working directory:

```typescript
await PDF.generate('report.pdf', buffer);
```

### Files, Archives and Downloads

Every route takes two more ways to bring files besides uploading them:

```typescript
type RequestInputOptions = {
    archives?: PathLikeOrReadStream[]; // ZIP files Gotenberg unpacks; each entry counts as an uploaded file
    downloadFrom?: DownloadFrom; // URLs Gotenberg downloads first, as if the files had been uploaded
};

type DownloadFromEntry = {
    url: string;
    extraHttpHeaders?: Record<string, string>; // Headers sent with the download
    filename?: string; // Names the file, over the server's Content-Disposition header and the URL path
};

type DownloadFrom = DownloadFromEntry | DownloadFromEntry[];
```

```typescript
const buffer = await LibreOffice.convert({
    files: [],
    downloadFrom: {
        url: 'https://files.example.com/download?id=42',
        extraHttpHeaders: { Authorization: 'Bearer …' },
        filename: 'report.docx'
    }
});
```

A stage can name a downloaded file with `{ name: 'report.docx' }` — see [Stages](#stages).

### Webhooks

Pass `webhook` to have Gotenberg upload the result to your storage, instead of answering with it. Gotenberg answers `204 No Content` right away, uploads the result to `webhookUrl`, then posts a `webhook.success` or `webhook.error` event to `webhookEventsUrl`. Both URLs are required.

```typescript
type WebhookOptions = {
    webhookUrl: string; // Receives the result
    webhookEventsUrl: string; // Receives the success or error event
    webhookMethod?: 'POST' | 'PUT' | 'PATCH'; // The method of the upload (default POST)
    webhookExtraHttpHeaders?: Record<string, string>; // Sent with the upload and the event
};
```

```typescript
await new UrlConverter().convert({
    url: 'https://www.example.com/',
    webhook: {
        webhookUrl: 'https://example.com/upload',
        webhookEventsUrl: 'https://example.com/events',
        webhookExtraHttpHeaders: { Authorization: 'Bearer abc123' }
    },
    trace: 'my-request-42' // Comes back as the event's correlationId
});
```

The `PDF` read routes don't take a webhook.

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

const buffer = await new UrlConverter().convert({
    url: 'https://www.example.com/',
    outputFilename: 'my-document',
    trace: 'my-correlation-id'
});
```

The [System](#system) routes and the PDF read routes accept `trace` too (there's no resulting file, so no `outputFilename`):

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
interface InvoiceClassicTemplateData extends Omit<
    InvoiceSaasTemplateData,
    'companyLogo'
> {
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

### System

The `System` class exposes Gotenberg system endpoints. Every method accepts an optional `trace` argument (custom request id, mapped to the `Gotenberg-Trace` header — see [Output Filename and Request Tracing](#output-filename-and-request-tracing)):

```typescript
import { System } from 'chromiumly';

const health = await System.getHealth(); // GET /health
const heartbeat = await System.headHealth(); // HEAD /health
const version = await System.getVersion(); // GET /version
const debug = await System.getDebug(); // GET /debug
const tracedHealth = await System.getHealth('my-correlation-id');
```

Gotenberg 9 removed the Prometheus route: it exports its metrics with OpenTelemetry, which can still serve them to Prometheus. See [Upgrade from 8.x](https://gotenberg.dev/docs/getting-started/upgrade#metrics).

## Migrating from Chromiumly 6

Chromiumly 7 targets Gotenberg 9. Most changes follow [Gotenberg's own upgrade guide](https://gotenberg.dev/docs/getting-started/upgrade).

**`PDFEngines` becomes `PDF`.**

| Chromiumly 6                             | Chromiumly 7                                                                  |
| :--------------------------------------- | :---------------------------------------------------------------------------- |
| `PDFEngines.merge()`                     | `PDF.merge()`                                                                 |
| `PDFEngines.split({ options })`          | `PDF.split({ every })` or `PDF.split({ ranges })`; `PDF.select()` for `unify` |
| `PDFEngines.flatten()`                   | `PDF.flattenForm()`                                                           |
| `PDFEngines.convert({ pdfa, pdfUA })`    | `PDF.remediate({ profile })`                                                  |
| `PDFEngines.readMetadata()`              | `PDF.metadata()`, which resolves to parsed JSON                               |
| `PDFEngines.writeMetadata({ metadata })` | `PDF.setMetadata({ title, author, … })`: the eight standard fields            |
| `PDFEngines.readBookmarks()`             | `PDF.bookmarks()`, which resolves to parsed JSON                              |
| `PDFEngines.writeBookmarks()`            | `PDF.setBookmarks()`: bookmarks take `pageNumber` instead of `page`           |
| `PDFEngines.encrypt({ options })`        | `PDF.encrypt({ userPassword, ownerPassword, permissions })`                   |
| `PDFEngines.embed({ embeds })`           | `PDF.attach({ file })`, one file per call, or one `attach` stage per file     |
| `PDFEngines.watermark()` / `stamp()`     | `PDF.stampText()`, `PDF.stampImage()` or `PDF.stampPdf()`                     |
| `PDFEngines.rotate()`                    | `PDF.rotate()`                                                                |
| `PDFEngines.facturX({ facturx })`        | `PDF.remediate({ profile: 'Factur-X', xml, level })`                          |
| `PDFEngines.generate()`                  | `PDF.generate()`                                                              |

**Post-processing options become stages.** On the Chromium and LibreOffice `convert()` methods:

| Chromiumly 6                              | Chromiumly 7 stage                                                          |
| :---------------------------------------- | :-------------------------------------------------------------------------- |
| `merge: true` (LibreOffice)               | `{ op: 'merge' }`                                                           |
| `split: { mode: 'intervals', span }`      | `{ op: 'split', every }`                                                    |
| `split: { mode: 'pages', span }`          | `{ op: 'split', ranges: [...] }`, or `{ op: 'select', pages }` for `unify`  |
| `pdfa`, `pdfUA`, `pdfFormat`              | `{ op: 'remediate', profile }`, or LibreOffice's `nativePdfa`/`nativePdfua` |
| `metadata`                                | `{ op: 'set-metadata', … }`                                                 |
| `userPassword`, `ownerPassword`, `allow*` | `{ op: 'encrypt', userPassword, ownerPassword, permissions }`               |
| `embeds`, `embedsMetadata`                | `{ op: 'attach', file, mimeType, relationship }`, one per file              |
| `watermark`, `stamp`                      | `stamp-text`, `stamp-image` or `stamp-pdf`, always over the page            |
| `rotate`                                  | `{ op: 'rotate', angle, pages }`                                            |
| `flatten`                                 | `{ op: 'flatten-form' }`                                                    |
| `facturx`                                 | `{ op: 'remediate', profile: 'Factur-X', xml, level }`                      |

**Renamed fields.**

| Where       | Chromiumly 6                                                                         | Chromiumly 7                                                      |
| :---------- | :----------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| Chromium    | `generateDocumentOutline`                                                            | `nativeBookmarks`                                                 |
| Chromium    | `generateTaggedPdf`                                                                  | `nativeTaggedPdf`                                                 |
| Chromium    | `properties.nativePageRanges`                                                        | `properties.nativePages`                                          |
| Chromium    | `emulatedMediaFeatures: [{ name, value }]`                                           | `emulatedMediaFeatures: { [name]: value }`                        |
| Screenshots | `quality`, 0 to 100                                                                  | `quality`, 1 to 100                                               |
| LibreOffice | `properties.nativePageRanges`                                                        | `properties.nativePages`                                          |
| LibreOffice | `properties.singlePageSheets`                                                        | `properties.singlePage`                                           |
| LibreOffice | `properties.exportBookmarks`                                                         | `properties.nativeBookmarks`                                      |
| LibreOffice | `quality`, `losslessImageCompression`, `reduceImageResolution`, `maxImageResolution` | the same, prefixed with `native`                                  |
| LibreOffice | `initialView`, `magnification`, `pageLayout` as numbers                              | strings, such as `'thumbnails'`, `'fitWidth'`, `'twoColumnRight'` |
| LibreOffice | `nativeWatermarkColor`, a decimal number                                             | `#rrggbb`                                                         |
| LibreOffice | `nativeWatermarkFontHeight`, `nativeWatermarkFontName`                               | `nativeWatermarkFontSize`, `nativeWatermarkFont`                  |
| LibreOffice | `nativeWatermarkRotateAngle`, in tenths of a degree                                  | `nativeWatermarkRotation`, in degrees                             |
| LibreOffice | `firstPageOnLeft`                                                                    | Removed                                                           |
| All         | `downloadFrom[].embedded`, `downloadFrom[].field`                                    | Removed: name the download in a stage with `{ name }`             |

**Other changes.**

- `webhook` requires both `webhookUrl` and `webhookEventsUrl`; `webhookErrorUrl` and `webhookErrorMethod` are gone, and errors arrive as `webhook.error` events.
- `System.getPrometheusMetrics()` is gone, with Gotenberg's Prometheus route.
- The `PdfFormat` enum and the `PdfEngine*` types are gone; use the `PdfaProfile`, `ConformanceProfiles` and stage types.
- LibreOffice no longer accepts `.epub`.
- New: every stage, `archives`, `downloadFrom[].filename`, `paperSize`, `waitForWindowStatus`, `failOnConsoleMessageTypes`, the screenshot `selector`, and the `PDF` read routes.

## Snippet

The following is a short snippet of how to use the library.

```typescript
import { PDF, UrlConverter } from 'chromiumly';

async function run() {
    const urlConverter = new UrlConverter();
    const buffer = await urlConverter.convert({
        url: 'https://gotenberg.dev/',
        properties: {
            paperSize: 'A4',
            printBackground: true
        },
        emulatedMediaType: 'screen',
        emulatedMediaFeatures: {
            'prefers-color-scheme': 'dark',
            'prefers-reduced-motion': 'reduce'
        },
        failOnHttpStatusCodes: [404],
        failOnConsoleExceptions: true,
        skipNetworkIdleEvent: false,
        skipNetworkAlmostIdleEvent: false,
        nativeBookmarks: true,
        stages: [
            { op: 'select', pages: '1-2' },
            { op: 'stamp-text', text: 'DRAFT', x: 72, y: 72 }
        ]
    });

    await PDF.generate('gotenberg.pdf', buffer);
}

run();
```
