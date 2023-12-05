// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from "fs";

import FormData from "form-data";
import fetch from "node-fetch";

import { PdfFormat } from "../../../common";
import { MarkdownConverter } from "../markdown.converter";

const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());

describe("MarkdownConverter", () => {
  const mockPromisesAccess = jest.spyOn(promises, "access");
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockFormDataAppend = jest.spyOn(FormData.prototype, "append");

  const converter = new MarkdownConverter();
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("endpoint", () => {
    it("should route to Chromium Markdown route", () => {
      expect(converter.endpoint).toEqual(
        "http://localhost:3000/forms/chromium/convert/markdown"
      );
    });
  });

  describe("convert", () => {
    beforeEach(() => {
      (createReadStream as jest.Mock) = jest
        .fn()
        .mockImplementation((file) => file);
    });

    describe("when files exist", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          markdown: "path/to/file.md",
        });
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when buffers passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: Buffer.from("html"),
          markdown: Buffer.from("markdown"),
        });
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when pdf format parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          markdown: "path/to/file.md",
          pdfFormat: PdfFormat.A_2b,
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when page properties parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          markdown: "path/to/file.md",
          properties: { size: { width: 8.3, height: 11.7 } },
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when header parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          markdown: "path/to/file.md",
          header: "path/to/header.html",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when footer parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          markdown: "path/to/file.md",
          footer: "path/to/footer.html",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when emulatedMediaType parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          markdown: "path/to/file.md",
          emulatedMediaType: "screen",
        });

        expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when all parameters are passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          markdown: "path/to/file.md",
          header: "path/to/header.html",
          footer: "path/to/footer.html",
          pdfFormat: PdfFormat.A_1a,
          emulatedMediaType: "screen",
          properties: { size: { width: 8.3, height: 11.7 } },
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(8);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when file does not exist", () => {
      it("should throw an error", async () => {
        const errorMessage =
          "ENOENT: no such file or directory, access 'path/to/index.html'";
        mockPromisesAccess.mockRejectedValue(new Error(errorMessage));

        await expect(() =>
          converter.convert({
            html: "path/to/index.html",
            markdown: "path/to/file.md",
          })
        ).rejects.toThrow(errorMessage);
      });
    });

    describe("when fetch request fails", () => {
      it("should throw an error", async () => {
        const errorMessage =
          "FetchError: request to http://localhost:3000/forms/chromium/convert/html failed";
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockRejectedValue(new Error(errorMessage));
        await expect(() =>
          converter.convert({
            html: "path/to/index.html",
            markdown: "path/to/file.md",
          })
        ).rejects.toThrow(errorMessage);
      });
    });
  });
});
