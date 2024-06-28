// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';
import path from 'path';
import FormData from 'form-data';
import { ConverterUtils } from '../converter.utils';
import { GotenbergUtils, PdfFormat } from '../../../common';

describe('ConverterUtils', () => {
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const data = new FormData();

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
                    expect(data.append).toHaveBeenCalledWith(
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
                    expect(data.append).toHaveBeenCalledWith('paperWidth', 8.3);
                    expect(data.append).toHaveBeenNthCalledWith(
                        2,
                        'paperHeight',
                        11.7
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
                    expect(data.append).toHaveBeenCalledWith('marginTop', 0.5);
                    expect(data.append).toHaveBeenNthCalledWith(
                        2,
                        'marginBottom',
                        0.5
                    );
                    expect(data.append).toHaveBeenNthCalledWith(
                        3,
                        'marginLeft',
                        1
                    );
                    expect(data.append).toHaveBeenNthCalledWith(
                        4,
                        'marginRight',
                        1
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
                    expect(data.append).toHaveBeenCalledWith(
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
                    expect(data.append).toHaveBeenCalledWith(
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
                    expect(data.append).toHaveBeenCalledWith(
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
                    expect(data.append).toHaveBeenCalledWith(
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
                    expect(data.append).toHaveBeenCalledWith('scale', 1.5);
                });
            });
        });

        describe('Page ranges', () => {
            describe('when nativePageRanges is valid', () => {
                it('should append nativePageRanges to data', () => {
                    ConverterUtils.addPageProperties(data, {
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
    });

    describe('addFile', () => {
        const __tmp__ = path.resolve(process.cwd(), '__tmp__');
        const filePath = path.resolve(__tmp__, 'file.html');

        beforeAll(async () => {
            await promises.mkdir(path.resolve(__tmp__), { recursive: true });
            await promises.writeFile(filePath, 'data');
        });

        afterAll(async () => {
            await promises.rm(path.resolve(__tmp__), { recursive: true });
        });

        describe('when file is passed as read stream', () => {
            it('should append file to data', async () => {
                const file = createReadStream(filePath);
                await GotenbergUtils.addFile(data, file, 'file');
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('files', file, 'file');
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
                expect(data.append).toHaveBeenCalledWith('files', file, 'file');
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
                expect(data.append).toHaveBeenCalledWith(
                    'files',
                    Buffer.from('header'),
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
                expect(data.append).toHaveBeenCalledWith(
                    'files',
                    Buffer.from('footer'),
                    'footer.html'
                );
            });
        });

        describe('when pdf format parameter is passed', () => {
            it('should append pdf format', async () => {
                await ConverterUtils.customize(data, {
                    pdfFormat: PdfFormat.A_1a
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('pdfa', 'PDF/A-1a');
            });
        });

        describe('when pdf universal access parameter is passed', () => {
            it('should append pdfua format', async () => {
                await ConverterUtils.customize(data, {
                    pdfUA: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('pdfua', 'true');
            });
        });

        describe('when page properties parameter is passed', () => {
            it('should append page propertiers', async () => {
                await ConverterUtils.customize(data, {
                    properties: { size: { width: 8.3, height: 11.7 } }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(data.append).toHaveBeenCalledWith('paperWidth', 8.3);
                expect(data.append).toHaveBeenNthCalledWith(
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
                expect(data.append).toHaveBeenCalledWith(
                    'emulatedMediaType',
                    'screen'
                );
            });
        });

        describe('when waitDelay parameter is passed', () => {
            it('should append waitDelay', async () => {
                await ConverterUtils.customize(data, {
                    waitDelay: '5s'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('waitDelay', '5s');
            });
        });

        describe('when waitForExpression parameter is passed', () => {
            it('should append waitForExpression', async () => {
                await ConverterUtils.customize(data, {
                    waitForExpression: "document.readyState === 'complete'"
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'waitForExpression',
                    "document.readyState === 'complete'"
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
                expect(data.append).toHaveBeenCalledWith(
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
                expect(data.append).toHaveBeenCalledWith(
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
                expect(data.append).toHaveBeenCalledWith(
                    'failOnConsoleExceptions',
                    'true'
                );
            });
        });

        describe('when metadata parameter is passed', () => {
            it('should append metadata', async () => {
                await ConverterUtils.customize(data, {
                    metadata: { Author: 'John Doe' }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'metadata',
                    JSON.stringify({ Author: 'John Doe' })
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
                expect(data.append).toHaveBeenCalledWith(
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

        describe('when all options are passed', () => {
            it('should append all options', async () => {
                await ConverterUtils.customize(data, {
                    header: Buffer.from('header.html'),
                    footer: Buffer.from('footer.html'),
                    pdfFormat: PdfFormat.A_1a,
                    pdfUA: true,
                    emulatedMediaType: 'screen',
                    properties: { size: { width: 8.3, height: 11.7 } },
                    waitDelay: '5s',
                    waitForExpression: "document.readyState === 'complete'",
                    userAgent:
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    extraHttpHeaders: { 'X-Custom-Header': 'value' },
                    failOnHttpStatusCodes: [499, 599],
                    skipNetworkIdleEvent: true,
                    failOnConsoleExceptions: true,
                    metadata: { Author: 'John Doe' }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(15);
                expect(data.append).toHaveBeenNthCalledWith(
                    1,
                    'pdfa',
                    'PDF/A-1a'
                );
                expect(data.append).toHaveBeenNthCalledWith(2, 'pdfua', 'true');
                expect(data.append).toHaveBeenNthCalledWith(
                    3,
                    'files',
                    Buffer.from('header.html'),
                    'header.html'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    4,
                    'files',
                    Buffer.from('footer.html'),
                    'footer.html'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    5,
                    'emulatedMediaType',
                    'screen'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    6,
                    'paperWidth',
                    8.3
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    7,
                    'paperHeight',
                    11.7
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    8,
                    'waitDelay',
                    '5s'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    9,
                    'waitForExpression',
                    "document.readyState === 'complete'"
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    10,
                    'userAgent',
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    11,
                    'extraHttpHeaders',
                    JSON.stringify({ 'X-Custom-Header': 'value' })
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    12,
                    'failOnHttpStatusCodes',
                    JSON.stringify([499, 599])
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    13,
                    'failOnConsoleExceptions',
                    'true'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    14,
                    'skipNetworkIdleEvent',
                    'true'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    15,
                    'metadata',
                    JSON.stringify({ Author: 'John Doe' })
                );
            });
        });
    });
});
