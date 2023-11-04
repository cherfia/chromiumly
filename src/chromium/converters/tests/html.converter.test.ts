// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from "fs";

import fetch from "node-fetch";
import FormData from "form-data";

import { PdfFormat } from "../../../common";
import { HtmlConverter } from "../html.converter";

const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());

describe("HtmlConverter", () => {
  const mockPromisesAccess = jest.spyOn(promises, "access");
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockFormDataAppend = jest.spyOn(FormData.prototype, "append");

  const converter = new HtmlConverter();
  beforeEach(() => {
    (createReadStream as jest.Mock) = jest
      .fn()
      .mockImplementation((file) => file);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("endpoint", () => {
    it("should route to Chromium HTML route", () => {
      expect(converter.endpoint).toEqual(
        "http://localhost:3000/forms/chromium/convert/html"
      );
    });
  });

  describe("convert", () => {
    describe("when file exists", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({ html: "path/to/index.html" });
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when pdf format parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          pdfFormat: PdfFormat.A_1a,
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when page properties parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          properties: { size: { width: 8.3, height: 11.7 } },
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when header parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          header: "path/to/header.html",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when footer parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          footer: "path/to/footer.html",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when emulatedMediaType parameter is passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          emulatedMediaType: "screen",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when all parameters are passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          html: "path/to/index.html",
          header: "path/to/header.html",
          footer: "path/to/footer.html",
          pdfFormat: PdfFormat.A_1a,
          emulatedMediaType: "screen",
          properties: { size: { width: 8.3, height: 11.7 } },
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(7);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when file does not exist", () => {
      it("should throw an error", async () => {
        const errorMessage =
          "ENOENT: no such file or directory, access 'path/to/index.html'";
        mockPromisesAccess.mockRejectedValue(new Error(errorMessage));
        await expect(() =>
          converter.convert({ html: "path/to/index.html" })
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
          converter.convert({ html: "path/to/index.html" })
        ).rejects.toThrow(errorMessage);
      });
    });
  });
});
