// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {promises, createReadStream} from "fs";
import {LibreOfficeUtils} from "../libre-office.utils";

import FormData from "form-data";

describe("LibreOfficeUtils", () => {
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

    describe("addFiles", () => {
        describe("when files exist", () => {
            describe("when files parameter contains paths", () => {
                it("should append each file to data", async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await LibreOfficeUtils.addFiles(
                        ["path/to/file.docx", "path/to/file.bib"],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            })
            describe("when files parameter contains a buffer", () => {
                it("should append each file to data", async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await LibreOfficeUtils.addFiles(
                        [Buffer.from("data"), "path/to/file.bib"],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            })
        });

        describe("when one of the files has unsupported format", () => {
            it("should throw an error", async () => {
                mockPromisesAccess.mockResolvedValue();
                await expect(() =>
                    LibreOfficeUtils.addFiles(
                        ["path/to/file.rar", "path/to/file.pdf"],
                        data
                    )
                ).rejects.toThrow(".rar is not supported");
            });
        });

        describe("when one of the files does not exist", () => {
            it("should throw an error", async () => {
                const errorMessage =
                    "ENOENT: no such file or directory, access 'path/to/index.html'";
                mockPromisesAccess.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    LibreOfficeUtils.addFiles(
                        ["path/to/file.pdf", "path/to/another-file.pdf"],
                        data
                    )
                ).rejects.toThrow(errorMessage);
            });
        });
    });

    describe("addPageProperties", () => {
        describe("Page landscape", () => {
            describe("when landscape parameter is set", () => {
                it("should append landscape to data", () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        landscape: true,
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith("landscape", "true");
                });
            });
        });

        describe("Page ranges", () => {
            describe("when nativePageRanges is valid", () => {
                it("should append nativePageRanges to data", () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        nativePageRanges: {from: 1, to: 6},
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith("nativePageRanges", "1-6");
                });
            });
        });
    });
});
