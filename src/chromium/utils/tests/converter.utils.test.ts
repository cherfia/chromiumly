import { createReadStream, promises } from 'fs';
import { blob } from 'node:stream/consumers';

import { ConverterUtils } from '../converter.utils';
import { GotenbergUtils } from '../../../common';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file path'])),
    createReadStream: jest.fn()
}));

jest.mock('node:stream/consumers', () => ({
    blob: jest.fn().mockResolvedValue(new Blob(['stream content']))
}));

describe('ConverterUtils', () => {
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const data = new FormData();

    beforeEach(() => {
        jest.clearAllMocks();
        mockPromisesAccess.mockResolvedValue();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('addPageProperties', () => {
        describe('Single page', () => {
            describe('when singlePage parameter is set', () => {
                it('should append singlePage to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        singlePage: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'singlePage',
                        'true'
                    );
                });
            });
        });

        describe('Page size', () => {
            describe('when page size is valid', () => {
                it('should append page size to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: 8.3, height: 11.7 }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        8.3
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        11.7
                    );
                });
            });

            describe('when page size is valid with string units', () => {
                it('should append page size with inches', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: '8.5in', height: '11in' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        '8.5in'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        '11in'
                    );
                });

                it('should append page size with millimeters', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: '216mm', height: '279mm' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        '216mm'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        '279mm'
                    );
                });

                it('should append page size with points', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: '612pt', height: '792pt' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        '612pt'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        '792pt'
                    );
                });

                it('should append page size with pixels', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: '800px', height: '1056px' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        '800px'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        '1056px'
                    );
                });

                it('should append page size with centimeters', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: '21.6cm', height: '27.9cm' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        '21.6cm'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        '27.9cm'
                    );
                });

                it('should append page size with picas', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: '51pc', height: '66pc' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        '51pc'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        '66pc'
                    );
                });
            });

            describe('when page size has mixed numeric and string values', () => {
                it('should append mixed page size', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: 8.5, height: '11in' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        8.5
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        '11in'
                    );
                });
            });

            describe('when page size has invalid string format', () => {
                it('should throw error for invalid width unit', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            size: { width: '8.5inches', height: '11in' }
                        });
                    }).toThrow(
                        'width must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });

                it('should throw error for invalid height unit', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            size: { width: '8.5in', height: '11inch' }
                        });
                    }).toThrow(
                        'height must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });

                it('should throw error for missing unit', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            size: { width: '8.5', height: '11in' }
                        });
                    }).toThrow(
                        'width must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });

                it('should throw error for invalid format', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            size: { width: 'invalidin', height: '11in' }
                        });
                    }).toThrow(
                        'width must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });
            });

            describe('when only one dimension is set', () => {
                it('should append only width when height is omitted', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { width: 8.5 }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperWidth',
                        8.5
                    );
                });

                it('should append only height when width is omitted', () => {
                    ConverterUtils.addPageProperties(data, {
                        size: { height: 11 }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'paperHeight',
                        11
                    );
                });
            });
        });

        describe('Page margins', () => {
            describe('when page margins are valid', () => {
                it('should append page margins to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        margins: { top: 0.5, bottom: 0.5, left: 1, right: 1 }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginTop',
                        0.5
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'marginBottom',
                        0.5
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        3,
                        'marginLeft',
                        1
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        4,
                        'marginRight',
                        1
                    );
                });
            });

            describe('when page margins are valid with string units', () => {
                it('should append page margins with mixed units', () => {
                    ConverterUtils.addPageProperties(data, {
                        margins: {
                            top: '0.5in',
                            bottom: '10mm',
                            left: '1cm',
                            right: '72pt'
                        }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginTop',
                        '0.5in'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'marginBottom',
                        '10mm'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        3,
                        'marginLeft',
                        '1cm'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        4,
                        'marginRight',
                        '72pt'
                    );
                });

                it('should append page margins with pixels', () => {
                    ConverterUtils.addPageProperties(data, {
                        margins: {
                            top: '50px',
                            bottom: '50px',
                            left: '100px',
                            right: '100px'
                        }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginTop',
                        '50px'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'marginBottom',
                        '50px'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        3,
                        'marginLeft',
                        '100px'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        4,
                        'marginRight',
                        '100px'
                    );
                });

                it('should append page margins with picas', () => {
                    ConverterUtils.addPageProperties(data, {
                        margins: {
                            top: '3pc',
                            bottom: '3pc',
                            left: '5pc',
                            right: '5pc'
                        }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginTop',
                        '3pc'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'marginBottom',
                        '3pc'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        3,
                        'marginLeft',
                        '5pc'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        4,
                        'marginRight',
                        '5pc'
                    );
                });
            });

            describe('when page margins have mixed numeric and string values', () => {
                it('should append mixed page margins', () => {
                    ConverterUtils.addPageProperties(data, {
                        margins: {
                            top: 0.5,
                            bottom: '10mm',
                            left: 1,
                            right: '72pt'
                        }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginTop',
                        0.5
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        2,
                        'marginBottom',
                        '10mm'
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        3,
                        'marginLeft',
                        1
                    );
                    expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                        4,
                        'marginRight',
                        '72pt'
                    );
                });
            });

            describe('when page margins have invalid string format', () => {
                it('should throw error for invalid marginTop unit', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            margins: {
                                top: '0.5inches',
                                bottom: '10mm',
                                left: '1cm',
                                right: '72pt'
                            }
                        });
                    }).toThrow(
                        'marginTop must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });

                it('should throw error for invalid marginBottom unit', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            margins: {
                                top: '0.5in',
                                bottom: '10millimeters',
                                left: '1cm',
                                right: '72pt'
                            }
                        });
                    }).toThrow(
                        'marginBottom must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });

                it('should throw error for invalid marginLeft unit', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            margins: {
                                top: '0.5in',
                                bottom: '10mm',
                                left: '1centimeter',
                                right: '72pt'
                            }
                        });
                    }).toThrow(
                        'marginLeft must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });

                it('should throw error for invalid marginRight unit', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            margins: {
                                top: '0.5in',
                                bottom: '10mm',
                                left: '1cm',
                                right: '72points'
                            }
                        });
                    }).toThrow(
                        'marginRight must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });

                it('should throw error for missing unit', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            margins: {
                                top: '0.5',
                                bottom: '10mm',
                                left: '1cm',
                                right: '72pt'
                            }
                        });
                    }).toThrow(
                        'marginTop must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                });

                it('should throw error for negative numeric margin', () => {
                    expect(() => {
                        ConverterUtils.addPageProperties(data, {
                            margins: {
                                top: -0.5,
                                bottom: 0.5,
                                left: 1,
                                right: 1
                            }
                        });
                    }).toThrow('marginTop cannot be negative');
                });
            });

            describe('when only some margins are set', () => {
                it('should append only the provided margins', () => {
                    ConverterUtils.addPageProperties(data, {
                        margins: { top: 1, left: '1cm' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginTop',
                        1
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginLeft',
                        '1cm'
                    );
                });

                it('should append only bottom and right when only those are provided', () => {
                    ConverterUtils.addPageProperties(data, {
                        margins: { bottom: 1, right: '1cm' }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginBottom',
                        1
                    );
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'marginRight',
                        '1cm'
                    );
                });
            });
        });

        describe('Page css size', () => {
            describe('when preferCssPageSize parameter is set', () => {
                it('should append preferCssPageSize to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        preferCssPageSize: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'preferCssPageSize',
                        'true'
                    );
                });
            });
        });

        describe('Page background', () => {
            describe('when printBackground parameter is set', () => {
                it('should append printBackground to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        printBackground: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'printBackground',
                        'true'
                    );
                });
            });

            describe('when omitBackground parameter is set', () => {
                it('should append omitBackground to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        omitBackground: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'omitBackground',
                        'true'
                    );
                });
            });
        });

        describe('Page landscape', () => {
            describe('when landscape parameter is set', () => {
                it('should append landscape to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        landscape: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'landscape',
                        'true'
                    );
                });
            });
        });

        describe('Page scale', () => {
            describe('when page scale is valid', () => {
                it('should append scale to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        scale: 1.5
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'scale',
                        1.5
                    );
                });
            });
        });

        describe('Page ranges', () => {
            describe('when nativePages is valid', () => {
                it('should append nativePages to data', () => {
                    ConverterUtils.addPageProperties(data, {
                        nativePages: { from: 1, to: 6 }
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'nativePages',
                        '1-6'
                    );
                });
            });

            describe('when nativePages is a free-form string', () => {
                it('should append it as-is', () => {
                    ConverterUtils.addPageProperties(data, {
                        nativePages: '1-5, 8, 11-13'
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(mockFormDataAppend).toHaveBeenCalledWith(
                        'nativePages',
                        '1-5, 8, 11-13'
                    );
                });
            });
        });
    });

    describe('addFile', () => {
        const mockPromisesAccess = jest.spyOn(promises, 'access');
        const filePath = '/mock/path/file.html';

        beforeEach(() => {
            mockPromisesAccess.mockResolvedValue();
            const mockStream = {
                pipe: jest.fn(),
                on: jest.fn(),
                async *[Symbol.asyncIterator]() {
                    yield Buffer.from('file content');
                }
            };
            (createReadStream as jest.Mock).mockReturnValue(mockStream);
        });

        describe('when file is passed as read stream', () => {
            it('should append file to data', async () => {
                const file = createReadStream(filePath);
                await GotenbergUtils.addFile(data, file, 'file');
                const content = await blob(file);
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'files',
                    content,
                    'file'
                );
            });
        });

        describe('when file is passed as path', () => {
            it('should append file to data', async () => {
                await GotenbergUtils.addFile(data, filePath, 'file');
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            });
        });

        describe('when file is passed as buffer', () => {
            it('should append file to data', async () => {
                const file = Buffer.from('data');
                await GotenbergUtils.addFile(data, file, 'file');
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'files',
                    new Blob([file]),
                    'file'
                );
            });
        });
    });

    describe('customize', () => {
        describe('when no option is passed', () => {
            it('should not append anything', async () => {
                await ConverterUtils.customize(data, {});
                expect(mockFormDataAppend).toHaveBeenCalledTimes(0);
            });
        });

        describe('when header parameter is passed', () => {
            it('should append header', async () => {
                await ConverterUtils.customize(data, {
                    header: Buffer.from('header')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'files',
                    new Blob([Buffer.from('header')]),
                    'header.html'
                );
            });
        });

        describe('when footer parameter is passed', () => {
            it('should append footer', async () => {
                await ConverterUtils.customize(data, {
                    footer: Buffer.from('footer')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'files',
                    new Blob([Buffer.from('footer')]),
                    'footer.html'
                );
            });
        });

        describe('when page properties parameter is passed', () => {
            it('should append page properties', async () => {
                await ConverterUtils.customize(data, {
                    properties: { size: { width: 8.3, height: 11.7 } }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'paperWidth',
                    8.3
                );
                expect(mockFormDataAppend).toHaveBeenNthCalledWith(
                    2,
                    'paperHeight',
                    11.7
                );
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should append emulatedMediaType', async () => {
                await ConverterUtils.customize(data, {
                    emulatedMediaType: 'screen'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'emulatedMediaType',
                    'screen'
                );
            });
        });

        describe('when emulatedMediaFeatures parameter is passed', () => {
            it('should append emulatedMediaFeatures', async () => {
                const emulatedMediaFeatures = {
                    'prefers-color-scheme': 'dark',
                    'prefers-reduced-motion': 'reduce'
                };
                await ConverterUtils.customize(data, {
                    emulatedMediaFeatures
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'emulatedMediaFeatures',
                    JSON.stringify(emulatedMediaFeatures)
                );
            });
        });

        describe('when waitDelay parameter is passed', () => {
            it('should append waitDelay', async () => {
                await ConverterUtils.customize(data, {
                    waitDelay: '5s'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'waitDelay',
                    '5s'
                );
            });
        });

        describe('when waitForExpression parameter is passed', () => {
            it('should append waitForExpression', async () => {
                await ConverterUtils.customize(data, {
                    waitForExpression: "document.readyState === 'complete'"
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'waitForExpression',
                    "document.readyState === 'complete'"
                );
            });
        });

        describe('when waitForSelector parameter is passed', () => {
            it('should append waitForSelector', async () => {
                await ConverterUtils.customize(data, {
                    waitForSelector: '#ready-node'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'waitForSelector',
                    '#ready-node'
                );
            });
        });

        describe('when userAgent parameter is passed', () => {
            it('should append userAgent', async () => {
                const userAgent =
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';

                await ConverterUtils.customize(data, {
                    userAgent
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'userAgent',
                    userAgent
                );
            });
        });

        describe('when extraHttpHeaders parameter is passed', () => {
            it('should append extraHttpHeaders', async () => {
                const extraHttpHeaders = {
                    'X-Custom-Header': 'value'
                };

                await ConverterUtils.customize(data, {
                    extraHttpHeaders
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'extraHttpHeaders',
                    JSON.stringify(extraHttpHeaders)
                );
            });
        });

        describe('when failOnConsoleExceptions parameter is passed', () => {
            it('should append failOnConsoleExceptions', async () => {
                await ConverterUtils.customize(data, {
                    failOnConsoleExceptions: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'failOnConsoleExceptions',
                    'true'
                );
            });
        });

        describe('when cookies parameter is passed', () => {
            it('should append cookies', async () => {
                await ConverterUtils.customize(data, {
                    cookies: [
                        {
                            name: 'sample_id',
                            value: 'sample_value',
                            domain: 'example.com',
                            path: '/',
                            secure: true,
                            httpOnly: true,
                            sameSite: 'Strict'
                        }
                    ]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'cookies',
                    JSON.stringify([
                        {
                            name: 'sample_id',
                            value: 'sample_value',
                            domain: 'example.com',
                            path: '/',
                            secure: true,
                            httpOnly: true,
                            sameSite: 'Strict'
                        }
                    ])
                );
            });
        });

        describe('when downloadFrom parameter is passed', () => {
            it('should append downloadFrom', async () => {
                await ConverterUtils.customize(data, {
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
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

        describe('when native parameters are passed', () => {
            it('should append nativeBookmarks and nativeTaggedPdf', async () => {
                await ConverterUtils.customize(data, {
                    nativeBookmarks: true,
                    nativeTaggedPdf: true
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    ['nativeBookmarks', 'true'],
                    ['nativeTaggedPdf', 'true']
                ]);
            });
        });

        describe('when waitForWindowStatus parameter is passed', () => {
            it('should append waitForWindowStatus', async () => {
                await ConverterUtils.customize(data, {
                    waitForWindowStatus: 'ready'
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    ['waitForWindowStatus', 'ready']
                ]);
            });
        });

        describe('when failOnConsoleMessageTypes parameter is passed', () => {
            it('should append failOnConsoleMessageTypes as JSON', async () => {
                await ConverterUtils.customize(data, {
                    failOnConsoleMessageTypes: ['error', 'warning']
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    [
                        'failOnConsoleMessageTypes',
                        JSON.stringify(['error', 'warning'])
                    ]
                ]);
            });
        });

        describe('when stages parameter is passed', () => {
            it('should append the stages as JSON', async () => {
                await ConverterUtils.customize(data, {
                    stages: [
                        { op: 'set-metadata', title: 'Report' },
                        { op: 'encrypt', userPassword: 'secret' }
                    ]
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    [
                        'stages',
                        JSON.stringify([
                            { op: 'set-metadata', title: 'Report' },
                            { op: 'encrypt', userPassword: 'secret' }
                        ])
                    ]
                ]);
            });
        });

        describe('when all options are passed', () => {
            it('should append all options', async () => {
                await ConverterUtils.customize(data, {
                    header: Buffer.from('header.html'),
                    footer: Buffer.from('footer.html'),
                    properties: {
                        paperSize: 'A4',
                        size: { width: 8.3, height: 11.7 }
                    },
                    nativeBookmarks: true,
                    nativeTaggedPdf: true,
                    emulatedMediaType: 'screen',
                    emulatedMediaFeatures: { 'prefers-color-scheme': 'dark' },
                    waitDelay: '5s',
                    waitForExpression: "document.readyState === 'complete'",
                    waitForSelector: '#ready-node',
                    waitForWindowStatus: 'ready',
                    userAgent: 'Mozilla/5.0',
                    extraHttpHeaders: { 'X-Custom-Header': 'value' },
                    failOnHttpStatusCodes: [499, 599],
                    failOnResourceHttpStatusCodes: [499, 599],
                    ignoreResourceHttpStatusDomains: [
                        'sentry-cdn.com',
                        'analytics.example.com'
                    ],
                    failOnResourceLoadingFailed: true,
                    failOnConsoleExceptions: true,
                    failOnConsoleMessageTypes: ['error'],
                    skipNetworkIdleEvent: false,
                    skipNetworkAlmostIdleEvent: false,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    },
                    stages: [{ op: 'split', every: 2 }]
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    [
                        'files',
                        new Blob([Buffer.from('header.html')]),
                        'header.html'
                    ],
                    [
                        'files',
                        new Blob([Buffer.from('footer.html')]),
                        'footer.html'
                    ],
                    ['paperSize', 'A4'],
                    ['paperWidth', 8.3],
                    ['paperHeight', 11.7],
                    ['nativeBookmarks', 'true'],
                    ['nativeTaggedPdf', 'true'],
                    ['emulatedMediaType', 'screen'],
                    [
                        'emulatedMediaFeatures',
                        JSON.stringify({ 'prefers-color-scheme': 'dark' })
                    ],
                    ['waitDelay', '5s'],
                    ['waitForExpression', "document.readyState === 'complete'"],
                    ['waitForSelector', '#ready-node'],
                    ['waitForWindowStatus', 'ready'],
                    ['userAgent', 'Mozilla/5.0'],
                    [
                        'extraHttpHeaders',
                        JSON.stringify({ 'X-Custom-Header': 'value' })
                    ],
                    ['failOnHttpStatusCodes', JSON.stringify([499, 599])],
                    [
                        'failOnResourceHttpStatusCodes',
                        JSON.stringify([499, 599])
                    ],
                    [
                        'ignoreResourceHttpStatusDomains',
                        JSON.stringify([
                            'sentry-cdn.com',
                            'analytics.example.com'
                        ])
                    ],
                    ['failOnResourceLoadingFailed', 'true'],
                    ['failOnConsoleExceptions', 'true'],
                    ['failOnConsoleMessageTypes', JSON.stringify(['error'])],
                    ['skipNetworkIdleEvent', 'false'],
                    ['skipNetworkAlmostIdleEvent', 'false'],
                    [
                        'downloadFrom',
                        JSON.stringify([
                            {
                                url: 'http://example.com',
                                extraHttpHeaders: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        ])
                    ],
                    ['stages', JSON.stringify([{ op: 'split', every: 2 }])]
                ]);
            });
        });
    });
});
