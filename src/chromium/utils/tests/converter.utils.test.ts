// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from "fs";
import FormData from "form-data";
import { ConverterUtils } from "../converter.utils";
import { PdfFormat } from "../../../common";

describe("ConverterUtils", () => {
  const mockFormDataAppend = jest.spyOn(FormData.prototype, "append");
  const mockPromisesAccess = jest.spyOn(promises, "access");
  const data = new FormData();

  beforeEach(() => {
    (createReadStream as jest.Mock) = jest
      .fn()
      .mockImplementation((file) => file);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("injectPageProperties", () => {
    describe("Page size", () => {
      describe("when page size is valid", () => {
        it("should append page size to data", () => {
          ConverterUtils.injectPageProperties(data, {
            size: { width: 8.3, height: 11.7 },
          });
          expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
          expect(data.append).toHaveBeenCalledWith("paperWidth", 8.3);
          expect(data.append).toHaveBeenNthCalledWith(2, "paperHeight", 11.7);
        });
      });
    });

    describe("Page margins", () => {
      describe("when page margins are valid", () => {
        it("should append page margins to data", () => {
          ConverterUtils.injectPageProperties(data, {
            margins: { top: 0.5, bottom: 0.5, left: 1, right: 1 },
          });
          expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
          expect(data.append).toHaveBeenCalledWith("marginTop", 0.5);
          expect(data.append).toHaveBeenNthCalledWith(2, "marginBottom", 0.5);
          expect(data.append).toHaveBeenNthCalledWith(3, "marginLeft", 1);
          expect(data.append).toHaveBeenNthCalledWith(4, "marginRight", 1);
        });
      });
    });

    describe("Page css size", () => {
      describe("when preferCssPageSize parameter is set", () => {
        it("should append preferCssPageSize to data", () => {
          ConverterUtils.injectPageProperties(data, {
            preferCssPageSize: true,
          });
          expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
          expect(data.append).toHaveBeenCalledWith("preferCssPageSize", "true");
        });
      });
    });

    describe("Page background", () => {
      describe("when printBackground parameter is set", () => {
        it("should append printBackground to data", () => {
          ConverterUtils.injectPageProperties(data, {
            printBackground: true,
          });
          expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
          expect(data.append).toHaveBeenCalledWith("printBackground", "true");
        });
      });

      describe("when omitBackground parameter is set", () => {
        it("should append omitBackground to data", () => {
          ConverterUtils.injectPageProperties(data, {
            omitBackground: true,
          });
          expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
          expect(data.append).toHaveBeenCalledWith("omitBackground", "true");
        });
      });
    });

    describe("Page landscape", () => {
      describe("when landscape parameter is set", () => {
        it("should append landscape to data", () => {
          ConverterUtils.injectPageProperties(data, {
            landscape: true,
          });
          expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
          expect(data.append).toHaveBeenCalledWith("landscape", "true");
        });
      });
    });

    describe("Page scale", () => {
      describe("when page scale is valid", () => {
        it("should append scale to data", () => {
          ConverterUtils.injectPageProperties(data, {
            scale: 1.5,
          });
          expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
          expect(data.append).toHaveBeenCalledWith("scale", 1.5);
        });
      });
    });

    describe("Page ranges", () => {
      describe("when nativePageRanges is valid", () => {
        it("should append nativePageRanges to data", () => {
          ConverterUtils.injectPageProperties(data, {
            nativePageRanges: { from: 1, to: 6 },
          });
          expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
          expect(data.append).toHaveBeenCalledWith("nativePageRanges", "1-6");
        });
      });
    });
  });

  describe("customize", () => {
    describe("when no option is passed", () => {
      it("should not append anything", async () => {
        await ConverterUtils.customize(data, {});
        expect(mockFormDataAppend).toHaveBeenCalledTimes(0);
      });
    });

    describe("when header parameter is passed", () => {
      it("should append header", async () => {
        mockPromisesAccess.mockResolvedValue();
        await ConverterUtils.customize(data, {
          header: "path/to/header.html",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith(
          "header.html",
          "path/to/header.html"
        );
      });
    });

    describe("when footer parameter is passed", () => {
      it("should append footer", async () => {
        mockPromisesAccess.mockResolvedValue();
        await ConverterUtils.customize(data, {
          footer: "path/to/footer.html",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith(
          "footer.html",
          "path/to/footer.html"
        );
      });
    });

    describe("when pdf format parameter is passed", () => {
      it("should append pdf format", async () => {
        await ConverterUtils.customize(data, {
          pdfFormat: PdfFormat.A_1a,
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith("pdfFormat", "PDF/A-1a");
      });
    });

    describe("when page properties parameter is passed", () => {
      it("should append page propertiers", async () => {
        await ConverterUtils.customize(data, {
          properties: { size: { width: 8.3, height: 11.7 } },
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
        expect(data.append).toHaveBeenCalledWith("paperWidth", 8.3);
        expect(data.append).toHaveBeenNthCalledWith(2, "paperHeight", 11.7);
      });
    });

    describe("when emulatedMediaType parameter is passed", () => {
      it("should append emulatedMediaType", async () => {
        await ConverterUtils.customize(data, {
          emulatedMediaType: "screen",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith("emulatedMediaType", "screen");
      });
    });

    describe("when all options are passed", () => {
      it("should append all options", async () => {
        mockPromisesAccess.mockResolvedValue();

        await ConverterUtils.customize(data, {
          header: "path/to/header.html",
          footer: "path/to/footer.html",
          pdfFormat: PdfFormat.A_1a,
          emulatedMediaType: "screen",
          properties: { size: { width: 8.3, height: 11.7 } },
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(6);
        expect(data.append).toHaveBeenNthCalledWith(1, "pdfFormat", "PDF/A-1a");
        expect(data.append).toHaveBeenNthCalledWith(
          2,
          "header.html",
          "path/to/header.html"
        );
        expect(data.append).toHaveBeenNthCalledWith(
          3,
          "footer.html",
          "path/to/footer.html"
        );
        expect(data.append).toHaveBeenNthCalledWith(
          4,
          "emulatedMediaType",
          "screen"
        );
        expect(data.append).toHaveBeenNthCalledWith(5, "paperWidth", 8.3);
        expect(data.append).toHaveBeenNthCalledWith(6, "paperHeight", 11.7);
      });
    });
  });
});
