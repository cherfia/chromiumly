// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { promises, createReadStream } from 'fs';
import { LibreOfficeUtils } from '../libre-office.utils';

import FormData from 'form-data';
import { PdfFormat } from '../../../common';

describe('LibreOfficeUtils', () => {
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

    const data = new FormData();

    beforeEach(() => {
        (createReadStream as jest.Mock) = jest
            .fn()
            .mockImplementation((file) => file);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('addFiles', () => {
        describe('when files exist', () => {
            describe('when files parameter contains paths', () => {
                it('should append each file to data', async () => {
                    mockPromisesAccess.mockResolvedValue();
                    await LibreOfficeUtils.addFiles(
                        ['path/to/file.docx', 'path/to/file.bib'],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            });
            describe('when files parameter contains a buffer', () => {
                it('should append each file to data', async () => {
                    mockPromisesAccess.mockResolvedValueOnce();
                    await LibreOfficeUtils.addFiles(
                        [
                            { data: Buffer.from('data'), ext: 'csv' },
                            'path/to/file.bib'
                        ],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                });
            });
        });

        describe('when one of the files has undetermined format', () => {
            it('should throw an error', async () => {
                mockPromisesAccess.mockResolvedValueOnce();

                await expect(
                    LibreOfficeUtils.addFiles(
                        [
                            { data: Buffer.from('data'), ext: 'docx' },
                            'path/to/file.none'
                        ],
                        data
                    )
                ).rejects.toThrow('none is not supported');
            });
        });

        describe('when one of the files has unsupported format', () => {
            it('should throw an error', async () => {
                mockPromisesAccess.mockResolvedValueOnce();
                await expect(() =>
                    LibreOfficeUtils.addFiles(
                        ['path/to/file.rar', 'path/to/file.pdf'],
                        data
                    )
                ).rejects.toThrow('rar is not supported');
            });
        });

        describe('when one of the files does not exist', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    "ENOENT: no such file or directory, access 'path/to/index.html'";
                mockPromisesAccess.mockRejectedValueOnce(
                    new Error(errorMessage)
                );
                await expect(() =>
                    LibreOfficeUtils.addFiles(
                        ['path/to/file.pdf', 'path/to/another-file.pdf'],
                        data
                    )
                ).rejects.toThrow(errorMessage);
            });
        });
    });

    describe('addPageProperties', () => {
        describe('Page landscape', () => {
            describe('when landscape parameter is set', () => {
                it('should append landscape to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        landscape: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'landscape',
                        'true'
                    );
                });
            });
        });

        describe('Export form fields', () => {
            describe('when exportFormFields parameter is set', () => {
                it('should append exportFormFields to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportFormFields: false
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportFormFields',
                        'false'
                    );
                });
            });
        });

        describe('Page ranges', () => {
            describe('when nativePageRanges is valid', () => {
                it('should append nativePageRanges to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        nativePageRanges: { from: 1, to: 6 }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'nativePageRanges',
                        '1-6'
                    );
                });
            });
        });

        describe('Single page sheets', () => {
            describe('when singlePageSheets parameter is set', () => {
                it('should append singlePageSheets to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        singlePageSheets: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'singlePageSheets',
                        'true'
                    );
                });
            });
        });
    });

    describe('customize', () => {
        describe('when no option is passed', () => {
            it('should not append anything', async () => {
                await LibreOfficeUtils.customize(data, {});
                expect(mockFormDataAppend).toHaveBeenCalledTimes(0);
            });
        });

        describe('when pdf format parameter is passed', () => {
            it('should append pdf format', async () => {
                await LibreOfficeUtils.customize(data, {
                    pdfa: PdfFormat.A_2b
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('pdfa', 'PDF/A-2b');
            });
        });

        describe('when pdf universal access parameter is passed', () => {
            it('should append pdfua format', async () => {
                await LibreOfficeUtils.customize(data, {
                    pdfUA: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('pdfua', 'true');
            });
        });

        describe('when merge parameter is passed', () => {
            it('should append merge', async () => {
                await LibreOfficeUtils.customize(data, {
                    merge: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('merge', 'true');
            });
        });

        describe('when metadata parameter is passed', () => {
            it('should append metadata', async () => {
                await LibreOfficeUtils.customize(data, {
                    metadata: { Author: 'John Doe' }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'metadata',
                    JSON.stringify({ Author: 'John Doe' })
                );
            });
        });

        describe('when lossless image compression is passed', () => {
            it('should append losslessImageCompression', async () => {
                await LibreOfficeUtils.customize(data, {
                    losslessImageCompression: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'losslessImageCompression',
                    'true'
                );
            });
        });

        describe('when reduce image resolution is passed', () => {
            it('should append reduceImageResolution', async () => {
                await LibreOfficeUtils.customize(data, {
                    reduceImageResolution: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'reduceImageResolution',
                    'false'
                );
            });
        });

        describe('when page properties are passed', () => {
            it('should append page properties', async () => {
                await LibreOfficeUtils.customize(data, {
                    properties: {
                        singlePageSheets: true
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'singlePageSheets',
                    'true'
                );
            });
        });
    });
});
