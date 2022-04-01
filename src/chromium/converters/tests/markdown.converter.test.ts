import { createReadStream, promises } from "fs";

import fetch from "node-fetch";
import FormData from "form-data";

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
      (createReadStream as jest.Mock) = jest.fn().mockImplementation(() => {});
    });

    describe("when file exists", () => {
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

    describe("when pdf format parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          markdown: "path/to/file.md",
          pdfFormat: PdfFormat.A_2b,
        });
        expect(mockFormDataAppend).toBeCalledTimes(3);
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
        expect(mockFormDataAppend).toBeCalledTimes(4);
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
