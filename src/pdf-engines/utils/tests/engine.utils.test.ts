// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from "fs";
import FormData from "form-data";

import { PDFEngineUtils } from "./../engine.utils";

describe("PDFEngineUtils", () => {
  const mockPromisesAccess = jest.spyOn(promises, "access");
  const mockFormDataAppend = jest.spyOn(FormData.prototype, "append");
  const data = new FormData();

  beforeEach(() => {
    (createReadStream as jest.Mock) = jest
      .fn()
      .mockImplementation((file) => file);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("injectFiles", () => {
    describe("when files exist", () => {
      it("should append each file to data", async () => {
        mockPromisesAccess.mockResolvedValue();
        await PDFEngineUtils.injectFiles(
          ["path/to/file.pdf", "path/to/another-file.pdf"],
          data
        );
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
      });
    });

    describe("when one of the files is not PDF", () => {
      it("should throw an error", async () => {
        mockPromisesAccess.mockResolvedValue();
        await expect(() =>
          PDFEngineUtils.injectFiles(
            ["path/to/file.docx", "path/to/file.pdf"],
            data
          )
        ).rejects.toThrow(".docx is not supported");
      });
    });

    describe("when one of the files does not exist", () => {
      it("should throw an error", async () => {
        const errorMessage =
          "ENOENT: no such file or directory, access 'path/to/index.html'";
        mockPromisesAccess.mockRejectedValue(new Error(errorMessage));
        await expect(() =>
          PDFEngineUtils.injectFiles(
            ["path/to/file.pdf", "path/to/another-file.pdf"],
            data
          )
        ).rejects.toThrow(errorMessage);
      });
    });
  });
});
