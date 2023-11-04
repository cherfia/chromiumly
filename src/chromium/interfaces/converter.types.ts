type PageSize = {
  width: number; // Paper width, in inches (default 8.5)
  height: number; //Paper height, in inches (default 11)
};

type PageMargins = {
  top: number; // Top margin, in inches (default 0.39)
  bottom: number; // Bottom margin, in inches (default 0.39)
  left: number; // Left margin, in inches (default 0.39)
  right: number; // Right margin, in inches (default 0.39)
};

export type PageProperties = {
  size?: PageSize;
  margins?: PageMargins;
  preferCssPageSize?: boolean; // Define whether to prefer page size as defined by CSS (default false)
  printBackground?: boolean; // Print the background graphics (default false)
  landscape?: boolean; // Set the paper orientation to landscape (default false)
  scale?: number; // The scale of the page rendering (default 1.0)
  nativePageRanges?: { from: number; to: number }; // Page ranges to print
};

export type EmulatedMediaType = "screen" | "print";
