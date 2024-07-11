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

        describe('allow duplicate field names', () => {
            describe('when allowDuplicateFieldNames parameter is set', () => {
                it('should append allowDuplicateFieldNames to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        allowDuplicateFieldNames: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'allowDuplicateFieldNames',
                        'true'
                    );
                });
            });
        });

        describe('export bookmarks', () => {
            describe('when exportBookmarks parameter is set', () => {
                it('should append exportBookmarks to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportBookmarks: false
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportBookmarks',
                        'false'
                    );
                });
            });
        });

        describe('export bookmarks to pdf destination', () => {
            describe('when exportBookmarksToPdfDestination parameter is set', () => {
                it('should append exportBookmarksToPdfDestination to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportBookmarksToPdfDestination: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportBookmarksToPdfDestination',
                        'true'
                    );
                });
            });
        });

        describe('export placeholders', () => {
            describe('when exportPlaceholders parameter is set', () => {
                it('should append exportPlaceholders to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportPlaceholders: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportPlaceholders',
                        'true'
                    );
                });
            });
        });

        describe('export notes', () => {
            describe('when exportNotes parameter is set', () => {
                it('should append exportNotes to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportNotes: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportNotes',
                        'true'
                    );
                });
            });
        });

        describe('export notes pages', () => {
            describe('when exportNotesPages parameter is set', () => {
                it('should append exportNotesPages to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportNotesPages: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportNotesPages',
                        'true'
                    );
                });
            });
        });

        describe('export only notes pages', () => {
            describe('when exportOnlyNotesPages parameter is set', () => {
                it('should append exportOnlyNotesPages to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportOnlyNotesPages: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportOnlyNotesPages',
                        'true'
                    );
                });
            });
        });

        describe('export notes in margin', () => {
            describe('when exportNotesInMargin parameter is set', () => {
                it('should append exportNotesInMargin to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportNotesInMargin: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportNotesInMargin',
                        'true'
                    );
                });
            });
        });

        describe('convert Ooo target to pdf target', () => {
            describe('when convertOooTargetToPdfTarget parameter is set', () => {
                it('should append convertOooTargetToPdfTarget to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        convertOooTargetToPdfTarget: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'convertOooTargetToPdfTarget',
                        'true'
                    );
                });
            });
        });

        describe('export links relative fsys', () => {
            describe('when exportLinksRelativeFsys parameter is set', () => {
                it('should append exportLinksRelativeFsys to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        exportLinksRelativeFsys: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'exportLinksRelativeFsys',
                        'true'
                    );
                });
            });
        });
    });

    describe('export hidden slides', () => {
        describe('when exportHiddenSlides parameter is set', () => {
            it('should append exportHiddenSlides to data', () => {
                LibreOfficeUtils.addPageProperties(data, {
                    exportHiddenSlides: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'exportHiddenSlides',
                    'true'
                );
            });
        });
    });

    describe('skip empty pages', () => {
        describe('when skipEmptyPages parameter is set', () => {
            it('should append skipEmptyPages to data', () => {
                LibreOfficeUtils.addPageProperties(data, {
                    skipEmptyPages: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'skipEmptyPages',
                    'true'
                );
            });
        });
    });

    describe('add original document as stream', () => {
        describe('when addOriginalDocumentAsStream parameter is set', () => {
            it('should append addOriginalDocumentAsStream to data', () => {
                LibreOfficeUtils.addPageProperties(data, {
                    addOriginalDocumentAsStream: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'addOriginalDocumentAsStream',
                    'true'
                );
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
                    reduceImageResolution: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'reduceImageResolution',
                    'true'
                );
            });
        });

        describe('when quality is passed', () => {
            it('should append quality', async () => {
                await LibreOfficeUtils.customize(data, {
                    quality: 100
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('quality', 100);
            });
        });

        describe('when maximum image resolution is passed', () => {
            it('should maxImageResolution quality', async () => {
                await LibreOfficeUtils.customize(data, {
                    reduceImageResolution: true,
                    maxImageResolution: 75
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(data.append).toHaveBeenCalledWith(
                    'maxImageResolution',
                    75
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
