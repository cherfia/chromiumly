// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

import { PdfFormat } from "../../../common";
import { UrlConverter } from "../url.converter";

const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());

describe("HtmlConverter", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockFormDataAppend = jest.spyOn(FormData.prototype, "append");
  const mockPromisesAccess = jest.spyOn(promises, "access");

  const converter = new UrlConverter();

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
        "http://localhost:3000/forms/chromium/convert/url"
      );
    });
  });

  describe("convert", () => {
    describe("when URL is valid", () => {
      it("should return a buffer", async () => {
        mockFetch.mockResolvedValueOnce(new Response("content"));
        const buffer = await converter.convert({
          url: "http://www.example.com/",
        });
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when header parameter is passed", () => {
      it("should return a buffer", async () => {
        mockFetch.mockResolvedValueOnce(new Response("content"));
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          url: "http://www.example.com/",
          header: "path/to/header.html",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when footer parameter is passed", () => {
      it("should return a buffer", async () => {
        mockFetch.mockResolvedValueOnce(new Response("content"));
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await converter.convert({
          url: "http://www.example.com/",
          footer: "path/to/footer.html",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when pdf format parameter is passed", () => {
      it("should return a buffer", async () => {
        mockFetch.mockResolvedValueOnce(new Response("content"));
        const buffer = await converter.convert({
          url: "http://www.example.com/",
          pdfFormat: PdfFormat.A_3b,
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when page properties parameter is passed", () => {
      it("should return a buffer", async () => {
        mockFetch.mockResolvedValueOnce(new Response("content"));
        const buffer = await converter.convert({
          url: "http://www.example.com/",
          properties: { size: { width: 8.3, height: 11.7 } },
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
          url: "http://www.example.com/",
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
          url: "http://www.example.com/",
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

    describe("when URL is invalid", () => {
      it("should throw an error", async () => {
        await expect(() =>
          converter.convert({ url: "invalid url" })
        ).rejects.toThrow("Invalid URL");
      });
    });

    describe("when fetch request fails", () => {
      it("should throw an error", async () => {
        const errorMessage =
          "FetchError: request to http://localhost:3000/forms/chromium/convert/html failed";
        mockFetch.mockRejectedValueOnce(new Error(errorMessage));
        await expect(() =>
          converter.convert({ url: "http://www.example.com/" })
        ).rejects.toThrow(errorMessage);
      });
    });
  });
});
