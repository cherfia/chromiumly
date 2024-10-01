// eslint-disable-next-line @typescript-eslint/no-unused-vars
import FormData from 'form-data';
import { ScreenshotUtils } from './../screenshot.utils';

describe('ScreenshotUtils', () => {
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const data = new FormData();

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('addImageProperties', () => {
        describe('Image format', () => {
            describe('when format parameter is set', () => {
                it('should append format to data', () => {
                    ScreenshotUtils.addImageProperties(data, {
                        format: 'png'
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                    expect(data.append).toHaveBeenCalledWith('format', 'png');
                });
            });
        });

        describe('Image background', () => {
            describe('when omitBackground parameter is set', () => {
                it('should append omitBackground to data', () => {
                    ScreenshotUtils.addImageProperties(data, {
                        format: 'png',
                        omitBackground: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(data.append).toHaveBeenCalledWith('format', 'png');
                    expect(data.append).toHaveBeenNthCalledWith(
                        2,
                        'omitBackground',
                        'true'
                    );
                });
            });
        });

        describe('Image quality', () => {
            describe('when quality parameter is set', () => {
                it('should append quality to data', () => {
                    ScreenshotUtils.addImageProperties(data, {
                        format: 'jpeg',
                        quality: 50
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(data.append).toHaveBeenCalledWith('format', 'jpeg');
                    expect(data.append).toHaveBeenNthCalledWith(
                        2,
                        'quality',
                        50
                    );
                });
            });
        });

        describe('Image width', () => {
            describe('when width parameter is set', () => {
                it('should append width to data', () => {
                    ScreenshotUtils.addImageProperties(data, {
                        format: 'jpeg',
                        width: 800
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(data.append).toHaveBeenCalledWith('format', 'jpeg');
                    expect(data.append).toHaveBeenNthCalledWith(
                        2,
                        'width',
                        800
                    );
                });
            });
        });

        describe('Image height', () => {
            describe('when height parameter is set', () => {
                it('should append height to data', () => {
                    ScreenshotUtils.addImageProperties(data, {
                        format: 'jpeg',
                        height: 600
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(data.append).toHaveBeenCalledWith('format', 'jpeg');
                    expect(data.append).toHaveBeenNthCalledWith(
                        2,
                        'height',
                        600
                    );
                });
            });
        });

        describe('Image clip', () => {
            describe('when clip parameter is set', () => {
                it('should append clip to data', () => {
                    ScreenshotUtils.addImageProperties(data, {
                        format: 'png',
                        clip: true
                    });
                    expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                    expect(data.append).toHaveBeenCalledWith('format', 'png');
                    expect(data.append).toHaveBeenNthCalledWith(
                        2,
                        'clip',
                        'true'
                    );
                });
            });
        });
    });

    describe('customize', () => {
        describe('when no option is passed', () => {
            it('should not append anything', async () => {
                await ScreenshotUtils.customize(data, {});
                expect(mockFormDataAppend).toHaveBeenCalledTimes(0);
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should append emulatedMediaType', async () => {
                await ScreenshotUtils.customize(data, {
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
                await ScreenshotUtils.customize(data, {
                    waitDelay: '5s'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith('waitDelay', '5s');
            });
        });

        describe('when waitForExpression parameter is passed', () => {
            it('should append waitForExpression', async () => {
                await ScreenshotUtils.customize(data, {
                    waitForExpression: "document.readyState === 'complete'"
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'waitForExpression',
                    "document.readyState === 'complete'"
                );
            });
        });

        describe('when extraHttpHeaders parameter is passed', () => {
            it('should append extraHttpHeaders', async () => {
                const extraHttpHeaders = {
                    'X-Custom-Header': 'value'
                };

                await ScreenshotUtils.customize(data, {
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
                await ScreenshotUtils.customize(data, {
                    failOnConsoleExceptions: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'failOnConsoleExceptions',
                    'true'
                );
            });
        });

        describe('when failOnHttpStatusCodes parameter is passed', () => {
            it('should append failOnHttpStatusCodes', async () => {
                await ScreenshotUtils.customize(data, {
                    failOnHttpStatusCodes: [499, 599]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'failOnHttpStatusCodes',
                    JSON.stringify([499, 599])
                );
            });
        });

        describe('when skipNetworkIdleEvent parameter is passed', () => {
            it('should append skipNetworkIdleEvent', async () => {
                await ScreenshotUtils.customize(data, {
                    skipNetworkIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'skipNetworkIdleEvent',
                    'false'
                );
            });
        });

        describe('when optimizeForSpeed parameter is passed', () => {
            it('should append optimizeForSpeed', async () => {
                await ScreenshotUtils.customize(data, {
                    optimizeForSpeed: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'optimizeForSpeed',
                    'true'
                );
            });
        });

        describe('when downloadFrom parameter is passed', () => {
            it('should append downloadFrom', async () => {
                await ScreenshotUtils.customize(data, {
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'downloadFrom',
                    JSON.stringify({
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    })
                );
            });
        });

        describe('when all options are passed', () => {
            it('should append all options', async () => {
                await ScreenshotUtils.customize(data, {
                    emulatedMediaType: 'screen',
                    failOnHttpStatusCodes: [499, 599],
                    skipNetworkIdleEvent: false,
                    failOnConsoleExceptions: true,
                    properties: {
                        format: 'jpeg',
                        quality: 50
                    },
                    waitDelay: '5s',
                    waitForExpression: "document.readyState === 'complete'",
                    extraHttpHeaders: { 'X-Custom-Header': 'value' },
                    optimizeForSpeed: true,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(11);
                expect(data.append).toHaveBeenNthCalledWith(
                    1,
                    'emulatedMediaType',
                    'screen'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    2,
                    'format',
                    'jpeg'
                );
                expect(data.append).toHaveBeenNthCalledWith(3, 'quality', 50);
                expect(data.append).toHaveBeenNthCalledWith(
                    4,
                    'waitDelay',
                    '5s'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    5,
                    'waitForExpression',
                    "document.readyState === 'complete'"
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    6,
                    'extraHttpHeaders',
                    JSON.stringify({ 'X-Custom-Header': 'value' })
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    7,
                    'failOnHttpStatusCodes',
                    JSON.stringify([499, 599])
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    8,
                    'failOnConsoleExceptions',
                    'true'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    9,
                    'skipNetworkIdleEvent',
                    'false'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    10,
                    'optimizeForSpeed',
                    'true'
                );
                expect(data.append).toHaveBeenNthCalledWith(
                    11,
                    'downloadFrom',
                    JSON.stringify({
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    })
                );
            });
        });
    });
});
