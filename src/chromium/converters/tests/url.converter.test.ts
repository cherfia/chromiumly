import fetch from "node-fetch";
import FormData from "form-data";

import { PdfFormat } from "../../../common";
import { UrlConverter } from "../url.converter";

const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());

describe("HtmlConverter", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockFormDataAppend = jest.spyOn(FormData.prototype, "append");

  const converter = new UrlConverter();

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

    describe("when pdf format parameter is passed", () => {
      it("should return a buffer", async () => {
        mockFetch.mockResolvedValueOnce(new Response("content"));
        const buffer = await converter.convert({
          url: "http://www.example.com/",
          pdfFormat: PdfFormat.A_3b,
        });
        expect(mockFormDataAppend).toBeCalledTimes(2);
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
        expect(mockFormDataAppend).toBeCalledTimes(3);
        expect(buffer).toEqual(Buffer.from("content"));
      });
    });

    describe("when URL is invalid", () => {
      it("should throw an error", async () => {
        await expect(() =>
          converter.convert({ url: "invalid url" })
        ).rejects.toThrow("Invalid URL: invalid url");
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
