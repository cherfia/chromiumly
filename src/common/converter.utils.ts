import FormData from "form-data";
import fetch from "node-fetch";

import { PageProperties } from "./converter.types";

export class ConverterUtils {
  public static injectPageProperties(
    data: FormData,
    pageProperties: PageProperties
  ): void {
    if (pageProperties) {
      if (pageProperties.size) {
        data.append("paperWidth", pageProperties.size.width);
        data.append("paperHeight", pageProperties.size.height);
      }

      if (pageProperties.margins) {
        data.append("marginTop", pageProperties.margins.top);
        data.append("marginBottom", pageProperties.margins.bottom);
        data.append("marginLeft", pageProperties.margins.left);
        data.append("marginRight", pageProperties.margins.right);
      }

      if (pageProperties.preferCssPageSize) {
        data.append("preferCssPageSize", pageProperties.preferCssPageSize);
      }

      if (pageProperties.printBackground) {
        data.append("printBackground", pageProperties.printBackground);
      }

      if (pageProperties.landscape) {
        data.append("landscape", pageProperties.landscape);
      }

      if (pageProperties.scale) {
        data.append("scale", pageProperties.scale);
      }

      if (pageProperties.nativePageRanges) {
        data.append(
          "nativePageRanges",
          `${pageProperties.nativePageRanges.x}-${pageProperties.nativePageRanges.y}`
        );
      }
    }
  }

  static async fetch(endpoint: string, data: FormData): Promise<Buffer> {
    const response = await fetch(endpoint, {
      method: "post",
      body: data,
      headers: {
        ...data.getHeaders(),
      },
    });
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
