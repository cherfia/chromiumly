import FormData from "form-data";
import { ConverterUtils } from "../converter.utils";

describe("ConverterUtils", () => {
  const mockFormDataAppend = jest.spyOn(FormData.prototype, "append");
  const data = new FormData();

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
          expect(mockFormDataAppend).toBeCalledTimes(2);
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
          expect(mockFormDataAppend).toBeCalledTimes(4);
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
          expect(mockFormDataAppend).toBeCalledTimes(1);
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
          expect(mockFormDataAppend).toBeCalledTimes(1);
          expect(data.append).toHaveBeenCalledWith("printBackground", "true");
        });
      });
    });

    describe("Page landscape", () => {
      describe("when landscape parameter is set", () => {
        it("should append landscape to data", () => {
          ConverterUtils.injectPageProperties(data, {
            landscape: true,
          });
          expect(mockFormDataAppend).toBeCalledTimes(1);
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
          expect(mockFormDataAppend).toBeCalledTimes(1);
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
          expect(mockFormDataAppend).toBeCalledTimes(1);
          expect(data.append).toHaveBeenCalledWith("nativePageRanges", "1-6");
        });
      });
    });
  });
});
