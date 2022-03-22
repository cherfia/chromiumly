type PageSize = { width: number; height: number };

type PageMargins = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type PageProperties = {
  size?: PageSize;
  margins?: PageMargins;
  preferCssPageSize?: boolean;
  printBackground?: boolean;
  landscape?: boolean;
  scale?: number;
  nativePageRanges?: { x: number; y: number };
};
