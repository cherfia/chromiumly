// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {createReadStream, promises} from "fs";
import FormData from "form-data";
import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";

import {PdfFormat} from "../../common";
import {PDFEngine} from "../pdf.engine";

const {Response} = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());

describe("PDFEngine", () => {
    const mockPromisesAccess = jest.spyOn(promises, "access");
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
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
            });
        });

        describe("when properties are passed", () => {
            it("should return a buffer", async () => {
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockResolvedValue(new Response("content"));
                const buffer = await PDFEngine.convert({
                    files: ["path/to/file.docx", "path/to/file.bib"],
                    properties: {landscape: true},
                    pdfFormat: PdfFormat.A_1a,
                    pdfUA: true,
                    merge: true,
                });
                expect(buffer).toEqual(Buffer.from("content"));
                expect(mockFormDataAppend).toHaveBeenCalledTimes(6);
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
            expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        });
    });

    describe("generate", () => {
        const mockFilename = "test.pdf";
        const mockBuffer = Buffer.from("mock pdf content");

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should generate a PDF file", async () => {
            const mockGeneratedDir = path.join(process.cwd(), "__generated__");
            const mockGeneratedFilePath = path.join(mockGeneratedDir, mockFilename);

            const mockPromisesMkDir = jest
                .spyOn(fs, "mkdir")
                .mockResolvedValueOnce(mockGeneratedDir);

            const mockPromisesWriteFile = jest
                .spyOn(fs, "writeFile")
                .mockResolvedValueOnce();

            await PDFEngine.generate(mockFilename, mockBuffer);

            expect(mockPromisesMkDir).toHaveBeenCalledWith(mockGeneratedDir, {
                recursive: true,
            });

            expect(mockPromisesWriteFile).toHaveBeenCalledWith(
                mockGeneratedFilePath,
                mockBuffer
            );
        });

        it("should handle errors during file generation", async () => {
            jest
                .spyOn(fs, "mkdir")
                .mockRejectedValueOnce(new Error("Cannot create directory"));

            await expect(
                PDFEngine.generate(mockFilename, mockBuffer)
            ).rejects.toThrow("Cannot create directory");
        });

        it("should handle errors during file writing", async () => {
            jest
                .spyOn(fs, "writeFile")
                .mockRejectedValueOnce(new Error("Failed to write to file"));

            await expect(
                PDFEngine.generate(mockFilename, mockBuffer)
            ).rejects.toThrow("Failed to write to file");
        });
    });
});
