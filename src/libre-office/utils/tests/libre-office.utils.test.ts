import { promises, ReadStream } from 'fs';
import { blob } from 'node:stream/consumers';
import { LibreOfficeUtils } from '../libre-office.utils';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file content']))
}));

jest.mock('node:stream/consumers', () => ({
    blob: jest.fn().mockResolvedValue(new Blob(['stream content']))
}));

describe('LibreOfficeUtils', () => {
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

            describe('when files parameter contains a ReadStream', () => {
                it('should append each file to data', async () => {
                    const mockReadStream = {
                        pipe: jest.fn(),
                        on: jest.fn(),
                        read: jest.fn(),
                        [Symbol.toStringTag]: 'ReadStream'
                    } as unknown as ReadStream;
                    Object.setPrototypeOf(mockReadStream, ReadStream.prototype);
                    mockPromisesAccess.mockResolvedValueOnce();
                    await LibreOfficeUtils.addFiles(
                        [
                            { data: mockReadStream, ext: 'docx' },
                            'path/to/file.bib'
                        ],
                        data
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(blob).toHaveBeenCalledWith(mockReadStream);
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

        describe('when one of the files is an epub', () => {
            it('should throw an error', async () => {
                mockPromisesAccess.mockResolvedValueOnce();
                await expect(() =>
                    LibreOfficeUtils.addFiles(['path/to/book.epub'], data)
                ).rejects.toThrow('epub is not supported');
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
            describe('when nativePages is a range', () => {
                it('should append nativePages to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        nativePages: { from: 1, to: 6 }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'nativePages',
                        '1-6'
                    );
                });
            });

            describe('when nativePages is a free-form string', () => {
                it('should append it as-is', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        nativePages: '1,3,5-7'
                    });
                    expect(data.append).toHaveBeenCalledWith(
                        'nativePages',
                        '1,3,5-7'
                    );
                });
            });

            describe('when nativePages is an invalid range', () => {
                it('should throw an error', () => {
                    expect(() =>
                        LibreOfficeUtils.addPageProperties(data, {
                            nativePages: { from: 5, to: 2 }
                        })
                    ).toThrow('page ranges syntax error');
                });
            });
        });

        describe('Paper size', () => {
            describe('when paper size fields are set', () => {
                it('should append paperSize, paperWidth and paperHeight', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        paperSize: 'A4',
                        paperWidth: '200mm',
                        paperHeight: 11
                    });
                    expect(mockFormDataAppend.mock.calls).toEqual([
                        ['paperSize', 'A4'],
                        ['paperWidth', '200mm'],
                        ['paperHeight', '11']
                    ]);
                });
            });
        });

        describe('Single page', () => {
            describe('when singlePage parameter is set', () => {
                it('should append singlePage to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        singlePage: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'singlePage',
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

        describe('native bookmarks', () => {
            describe('when nativeBookmarks parameter is set to false', () => {
                it('should append nativeBookmarks to data', () => {
                    LibreOfficeUtils.addPageProperties(data, {
                        nativeBookmarks: false
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith(
                        'nativeBookmarks',
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

        describe('when updateIndexes parameter is set to false', () => {
            it('should append updateIndexes to data', () => {
                LibreOfficeUtils.addPageProperties(data, {
                    updateIndexes: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'updateIndexes',
                    'false'
                );
            });

            it('should not append updateIndexes when true (default)', () => {
                LibreOfficeUtils.addPageProperties(data, {
                    updateIndexes: true
                });
                expect(mockFormDataAppend).not.toHaveBeenCalled();
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

        describe('when native PDF fields are passed', () => {
            it('should append nativePdfa, nativePdfua and nativeTaggedPdf', async () => {
                await LibreOfficeUtils.customize(data, {
                    nativePdfa: 'PDF/A-2b',
                    nativePdfua: 'PDF/UA-1',
                    nativeTaggedPdf: true
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    ['nativePdfa', 'PDF/A-2b'],
                    ['nativePdfua', 'PDF/UA-1'],
                    ['nativeTaggedPdf', 'true']
                ]);
            });
        });

        describe('when lossless image compression is passed', () => {
            it('should append nativeLosslessImageCompression', async () => {
                await LibreOfficeUtils.customize(data, {
                    nativeLosslessImageCompression: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'nativeLosslessImageCompression',
                    'true'
                );
            });
        });

        describe('when reduce image resolution is passed', () => {
            it('should append nativeReduceImageResolution', async () => {
                await LibreOfficeUtils.customize(data, {
                    nativeReduceImageResolution: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'nativeReduceImageResolution',
                    'true'
                );
            });
        });

        describe('when quality is passed', () => {
            it('should append nativeQuality', async () => {
                await LibreOfficeUtils.customize(data, {
                    nativeQuality: 100
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'nativeQuality',
                    '100'
                );
            });

            it('should throw an error when it is out of range', async () => {
                await expect(
                    LibreOfficeUtils.customize(data, { nativeQuality: 0.5 })
                ).rejects.toThrow(
                    'Invalid compression quality. Please provide a value between 1 and 100.'
                );
            });
        });

        describe('when maximum image resolution is passed', () => {
            it('should append nativeMaxImageResolution', async () => {
                await LibreOfficeUtils.customize(data, {
                    nativeReduceImageResolution: true,
                    nativeMaxImageResolution: 75
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(data.append).toHaveBeenCalledWith(
                    'nativeMaxImageResolution',
                    '75'
                );
            });

            it('should throw an error without nativeReduceImageResolution', async () => {
                await expect(
                    LibreOfficeUtils.customize(data, {
                        nativeMaxImageResolution: 75
                    })
                ).rejects.toThrow(
                    'nativeMaxImageResolution is only supported when nativeReduceImageResolution is enabled.'
                );
            });
        });

        describe('when PDF viewer preference fields are passed', () => {
            it('should append all PDF viewer preference fields', async () => {
                await LibreOfficeUtils.customize(data, {
                    initialView: 'thumbnails',
                    initialPage: 3,
                    magnification: 'zoom',
                    zoom: 125,
                    pageLayout: 'twoColumnRight',
                    resizeWindowToInitialPage: true,
                    centerWindow: true,
                    openInFullScreenMode: true,
                    displayPDFDocumentTitle: false,
                    hideViewerMenubar: true,
                    hideViewerToolbar: true,
                    hideViewerWindowControls: true,
                    useTransitionEffects: false,
                    openBookmarkLevels: -1
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(14);
                expect(data.append).toHaveBeenCalledWith(
                    'initialView',
                    'thumbnails'
                );
                expect(data.append).toHaveBeenCalledWith('initialPage', '3');
                expect(data.append).toHaveBeenCalledWith(
                    'magnification',
                    'zoom'
                );
                expect(data.append).toHaveBeenCalledWith('zoom', '125');
                expect(data.append).toHaveBeenCalledWith(
                    'pageLayout',
                    'twoColumnRight'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'resizeWindowToInitialPage',
                    'true'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'centerWindow',
                    'true'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'openInFullScreenMode',
                    'true'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'displayPDFDocumentTitle',
                    'false'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'hideViewerMenubar',
                    'true'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'hideViewerToolbar',
                    'true'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'hideViewerWindowControls',
                    'true'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'useTransitionEffects',
                    'false'
                );
                expect(data.append).toHaveBeenCalledWith(
                    'openBookmarkLevels',
                    '-1'
                );
            });
        });

        describe('when downloadFrom parameter is passed', () => {
            it('should append downloadFrom', async () => {
                await LibreOfficeUtils.customize(data, {
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'downloadFrom',
                    JSON.stringify([
                        {
                            url: 'http://example.com',
                            extraHttpHeaders: {
                                'Content-Type': 'application/json'
                            }
                        }
                    ])
                );
            });
        });

        describe('when page properties are passed', () => {
            it('should append page properties', async () => {
                await LibreOfficeUtils.customize(data, {
                    properties: {
                        singlePage: true
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('singlePage', 'true');
            });
        });

        describe('when native LibreOffice watermark fields are passed', () => {
            it('should append native watermark fields', async () => {
                await LibreOfficeUtils.customize(data, {
                    nativeWatermarkText: 'DRAFT',
                    nativeWatermarkColor: '#ff0000',
                    nativeWatermarkFontSize: 48,
                    nativeWatermarkRotation: 45,
                    nativeWatermarkFont: 'Times New Roman'
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    ['nativeWatermarkText', 'DRAFT'],
                    ['nativeWatermarkColor', '#ff0000'],
                    ['nativeWatermarkFontSize', '48'],
                    ['nativeWatermarkRotation', '45'],
                    ['nativeWatermarkFont', 'Times New Roman']
                ]);
            });

            it('should append the tiled watermark text', async () => {
                await LibreOfficeUtils.customize(data, {
                    nativeTiledWatermarkText: 'COPY'
                });
                expect(data.append).toHaveBeenCalledWith(
                    'nativeTiledWatermarkText',
                    'COPY'
                );
            });

            it('should throw an error when both watermark texts are set', async () => {
                await expect(
                    LibreOfficeUtils.customize(data, {
                        nativeWatermarkText: 'DRAFT',
                        nativeTiledWatermarkText: 'COPY'
                    })
                ).rejects.toThrow(
                    'Set nativeWatermarkText or nativeTiledWatermarkText, not both'
                );
            });
        });

        describe('when stages parameter is passed', () => {
            it('should append the stages as JSON', async () => {
                await LibreOfficeUtils.customize(data, {
                    stages: [
                        { op: 'merge' },
                        { op: 'remediate', profile: 'PDF/A-2b' }
                    ]
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    [
                        'stages',
                        JSON.stringify([
                            { op: 'merge' },
                            { op: 'remediate', profile: 'PDF/A-2b' }
                        ])
                    ]
                ]);
            });
        });
    });
});
