import { promises, ReadStream } from 'fs';
import { blob } from 'node:stream/consumers';

import { PdfFormat } from '../../../common';
import { ConversionOptions } from '../../interfaces/pdf-engines.types';
import { PDFEnginesUtils } from '../pdf-engines.utils';

jest.mock('node:stream/consumers', () => ({
    blob: jest.fn().mockResolvedValue(new Blob(['stream content']))
}));

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file path'])),
    createReadStream: jest.fn()
}));

describe('PDFEnginesUtils', () => {
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const data = new FormData();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('addFiles', () => {
        describe('when files exist', () => {
            describe('when files parameter contains paths', () => {
                it('should append each file to data', async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await PDFEnginesUtils.addFiles(
                        ['path/to/file.pdf', 'path/to/another-file.pdf'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            });
            describe('when files parameter contains a buffer', () => {
                it('should append each file to data', async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await PDFEnginesUtils.addFiles(
                        [Buffer.from('data'), 'path/to/another-file.pdf'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            });

            describe('when files parameter contains a ReadStream', () => {
                it('should append each file to data', async () => {
                    const mockReadStream = {
                        pipe: jest.fn(),
                        on: jest.fn(),
                        read: jest.fn(),
                        [Symbol.toStringTag]: 'ReadStream'
                    } as unknown as ReadStream;
                    Object.setPrototypeOf(mockReadStream, ReadStream.prototype);
                    mockPromisesAccess.mockResolvedValue();
                    await PDFEnginesUtils.addFiles(
                        [mockReadStream, 'path/to/another-file.pdf'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(blob).toHaveBeenCalledWith(mockReadStream);
                });
            });
        });

        describe('when one of the files is not PDF', () => {
            it('should throw an error', async () => {
                mockPromisesAccess.mockResolvedValue();
                await expect(() =>
                    PDFEnginesUtils.addFiles(
                        ['path/to/file.docx', 'path/to/file.pdf'],
                        data
                    )
                ).rejects.toThrow('.docx is not supported');
            });
        });

        describe('when one of the files does not exist', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    "ENOENT: no such file or directory, access 'path/to/index.html'";
                mockPromisesAccess.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    PDFEnginesUtils.addFiles(
                        ['path/to/file.pdf', 'path/to/another-file.pdf'],
                        data
                    )
                ).rejects.toThrow(errorMessage);
            });
        });
    });

    describe('customize', () => {
        describe('when no pdfa or pdfUA is provided', () => {
            it('should throw an error', async () => {
                await expect(
                    PDFEnginesUtils.customize(data, {})
                ).rejects.toThrow(
                    'At least one of pdfa or pdfUA must be provided'
                );
            });
        });

        describe('when only pdfa is provided', () => {
            it('should append pdfa and not pdfUA', async () => {
                const options: ConversionOptions = { pdfa: PdfFormat.A_2b };
                await PDFEnginesUtils.customize(data, options);
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'pdfa',
                    PdfFormat.A_2b
                );
                expect(data.append).not.toHaveBeenCalledWith(
                    'pdfUA',
                    expect.any(String)
                );
            });
        });

        describe('when only pdfUA is provided', () => {
            it('should append pdfUA and not pdfa', async () => {
                const options: ConversionOptions = { pdfUA: true };
                await PDFEnginesUtils.customize(data, options);
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('pdfUA', 'true');
                expect(data.append).not.toHaveBeenCalledWith(
                    'pdfa',
                    expect.any(String)
                );
            });
        });

        describe('when both pdfa and pdfUA are provided', () => {
            it('should append both', async () => {
                await PDFEnginesUtils.customize(data, {
                    pdfa: PdfFormat.A_2b,
                    pdfUA: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(data.append).toHaveBeenCalledWith(
                    'pdfa',
                    PdfFormat.A_2b
                );
                expect(data.append).toHaveBeenCalledWith('pdfUA', 'true');
            });
        });
    });

    describe('addFilesWithFieldName', () => {
        describe('when files parameter contains paths', () => {
            it('should append each file to data with custom field name', async () => {
                mockPromisesAccess.mockResolvedValue();
                await PDFEnginesUtils.addFilesWithFieldName(
                    ['path/to/file.xml', 'path/to/another-file.xml'],
                    data,
                    'embeds'
                );
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
            });
        });

        describe('when files parameter contains a buffer', () => {
            it('should append each file to data with custom field name', async () => {
                await PDFEnginesUtils.addFilesWithFieldName(
                    [Buffer.from('data')],
                    data,
                    'embeds'
                );
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'embeds',
                    expect.any(Blob),
                    'file1'
                );
            });
        });

        describe('when files parameter contains a ReadStream', () => {
            it('should append each file to data with custom field name', async () => {
                const mockBlob = new Blob(['stream content']);
                (blob as jest.Mock).mockResolvedValue(mockBlob);
                const mockReadStream = {
                    pipe: jest.fn(),
                    on: jest.fn(),
                    read: jest.fn(),
                    [Symbol.toStringTag]: 'ReadStream'
                } as unknown as ReadStream;
                Object.setPrototypeOf(mockReadStream, ReadStream.prototype);
                await PDFEnginesUtils.addFilesWithFieldName(
                    [mockReadStream],
                    data,
                    'embeds'
                );
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(blob).toHaveBeenCalledWith(mockReadStream);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'embeds',
                    mockBlob,
                    'file1'
                );
            });
        });
    });
});
