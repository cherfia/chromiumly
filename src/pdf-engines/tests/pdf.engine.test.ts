import path from "path";

import { PDFEngine } from "./../pdf.engine";
import { PdfFormat } from "../../common";

import { promises, createReadStream } from "fs";

import fetch from "node-fetch";
import FormData from "form-data";

const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());

describe("PDFEngine", () => {
  const mockProcessCwd = jest.spyOn(process, "cwd");
  const mockPromisesAccess = jest.spyOn(promises, "access");
  const mockPromisesMkDir = jest.spyOn(promises, "mkdir");
  const mockPromisesWriteFile = jest.spyOn(promises, "writeFile");
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockFormDataAppend = jest.spyOn(FormData.prototype, "append");

  beforeEach(() => {
    (createReadStream as jest.Mock) = jest
      .fn()
      .mockImplementation((file) => file);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("convert", () => {
    describe("when no properties are passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await PDFEngine.convert({
          files: ["path/to/file.docx", "path/to/file.bib"],
        });
        expect(buffer).toEqual(Buffer.from("content"));
        expect(mockFormDataAppend).toBeCalledTimes(2);
      });
    });

    describe("when properties are passed", () => {
      it("should return a buffer", async () => {
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockResolvedValue(new Response("content"));
        const buffer = await PDFEngine.convert({
          files: ["path/to/file.docx", "path/to/file.bib"],
          properties: { landscape: true },
          pdfFormat: PdfFormat.A_1a,
          merge: true,
        });
        expect(buffer).toEqual(Buffer.from("content"));
        expect(mockFormDataAppend).toBeCalledTimes(5);
      });
    });
  });

  describe("merge", () => {
    it("should return a buffer", async () => {
      mockPromisesAccess.mockResolvedValue();
      mockFetch.mockResolvedValue(new Response("content"));
      const buffer = await PDFEngine.merge({
        files: ["path/to/file.pdf", "path/to/another-file.pdf"],
      });
      expect(buffer).toEqual(Buffer.from("content"));
      expect(mockFormDataAppend).toBeCalledTimes(2);
    });
  });

  describe("generate", () => {
    it("should generate a PDF file", async () => {
      mockProcessCwd.mockReturnValue("path/to/");
      mockPromisesMkDir.mockResolvedValue("__generated__");
      await PDFEngine.generate("file.pdf", Buffer.from("content"));
      expect(mockPromisesWriteFile).toBeCalledWith(
        path.resolve("path/to/__generated__/file.pdf"),
        Buffer.from("content")
      );
    });
  });
});
