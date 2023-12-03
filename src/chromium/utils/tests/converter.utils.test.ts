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

    describe("when waitDelay parameter is passed", () => {
      it("should append waitDelay", async () => {
        await ConverterUtils.customize(data, {
          waitDelay: "5s",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith("waitDelay", "5s");
      });
    });

    describe("when waitForExpression parameter is passed", () => {
      it("should append waitForExpression", async () => {
        await ConverterUtils.customize(data, {
          waitForExpression: "document.readyState === 'complete'",
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith(
          "waitForExpression",
          "document.readyState === 'complete'"
        );
      });
    });

    describe("when userAgent parameter is passed", () => {
      it("should append userAgent", async () => {
        const userAgent =
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";

        await ConverterUtils.customize(data, {
          userAgent,
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith("userAgent", userAgent);
      });
    });

    describe("when extraHttpHeaders parameter is passed", () => {
      it("should append extraHttpHeaders", async () => {
        const extraHttpHeaders = {
          "X-Custom-Header": "value",
        };

        await ConverterUtils.customize(data, {
          extraHttpHeaders,
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith(
          "extraHttpHeaders",
          JSON.stringify(extraHttpHeaders)
        );
      });
    });

    describe("when failOnConsoleExceptions parameter is passed", () => {
      it("should append failOnConsoleExceptions", async () => {
        await ConverterUtils.customize(data, {
          failOnConsoleExceptions: true,
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
        expect(data.append).toHaveBeenCalledWith(
          "failOnConsoleExceptions",
          "true"
        );
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
          waitDelay: "5s",
          waitForExpression: "document.readyState === 'complete'",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
          extraHttpHeaders: { "X-Custom-Header": "value" },
          failOnConsoleExceptions: true,
        });
        expect(mockFormDataAppend).toHaveBeenCalledTimes(11);
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
        expect(data.append).toHaveBeenNthCalledWith(7, "waitDelay", "5s");
        expect(data.append).toHaveBeenNthCalledWith(
          8,
          "waitForExpression",
          "document.readyState === 'complete'"
        );
        expect(data.append).toHaveBeenNthCalledWith(
          9,
          "userAgent",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        );
        expect(data.append).toHaveBeenNthCalledWith(
          10,
          "extraHttpHeaders",
          JSON.stringify({ "X-Custom-Header": "value" })
        );
        expect(data.append).toHaveBeenNthCalledWith(
          11,
          "failOnConsoleExceptions",
          "true"
        );
      });
    });
  });
});
