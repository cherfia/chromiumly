export interface IConverter {
  convert({ ...args }): Promise<Buffer> | Promise<void>;
}
