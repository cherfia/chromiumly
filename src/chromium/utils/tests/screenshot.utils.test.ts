import { promises } from 'fs';
import { ScreenshotUtils } from './../screenshot.utils';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file content']))
}));

describe('ScreenshotUtils', () => {
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
            describe('when quality is out of range', () => {
                it('should throw an error for 0', () => {
                    expect(() =>
                        ScreenshotUtils.addImageProperties(data, {
                            format: 'jpeg',
                            quality: 0
                        })
                    ).toThrow(
                        'Invalid compression quality. Please provide a value between 1 and 100.'
                    );
                });
            });

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

            describe('when deviceScaleFactor parameter is set', () => {
                it('should append deviceScaleFactor to data', () => {
                    ScreenshotUtils.addImageProperties(data, {
                        format: 'png',
                        deviceScaleFactor: 2
                    });
                    expect(data.append).toHaveBeenCalledWith(
                        'deviceScaleFactor',
                        '2'
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

        describe('when emulatedMediaFeatures parameter is passed', () => {
            it('should append emulatedMediaFeatures', async () => {
                const emulatedMediaFeatures = {
                    'prefers-color-scheme': 'dark',
                    'prefers-reduced-motion': 'reduce'
                };
                await ScreenshotUtils.customize(data, {
                    emulatedMediaFeatures
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'emulatedMediaFeatures',
                    JSON.stringify(emulatedMediaFeatures)
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

        describe('when waitForSelector parameter is passed', () => {
            it('should append waitForSelector', async () => {
                await ScreenshotUtils.customize(data, {
                    waitForSelector: '#ready-node'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'waitForSelector',
                    '#ready-node'
                );
            });
        });

        describe('when userAgent parameter is passed', () => {
            it('should append userAgent', async () => {
                await ScreenshotUtils.customize(data, {
                    userAgent: 'my-user-agent'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'userAgent',
                    'my-user-agent'
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

        describe('when skipNetworkAlmostIdleEvent parameter is passed', () => {
            it('should append skipNetworkAlmostIdleEvent', async () => {
                await ScreenshotUtils.customize(data, {
                    skipNetworkAlmostIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
                expect(data.append).toHaveBeenCalledWith(
                    'skipNetworkAlmostIdleEvent',
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

        describe('when all options are passed', () => {
            it('should append all options', async () => {
                await ScreenshotUtils.customize(data, {
                    emulatedMediaType: 'screen',
                    failOnHttpStatusCodes: [499, 599],
                    failOnResourceHttpStatusCodes: [499, 599],
                    ignoreResourceHttpStatusDomains: [
                        'sentry-cdn.com',
                        'analytics.example.com'
                    ],
                    failOnResourceLoadingFailed: true,
                    skipNetworkIdleEvent: false,
                    skipNetworkAlmostIdleEvent: false,
                    failOnConsoleExceptions: true,
                    properties: {
                        format: 'jpeg',
                        quality: 50,
                        selector: '#chart'
                    },
                    waitDelay: '5s',
                    waitForExpression: "document.readyState === 'complete'",
                    waitForSelector: '#ready-node',
                    extraHttpHeaders: { 'X-Custom-Header': 'value' },
                    optimizeForSpeed: true,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend.mock.calls).toEqual([
                    ['format', 'jpeg'],
                    ['quality', 50],
                    ['selector', '#chart'],
                    ['optimizeForSpeed', 'true'],
                    ['emulatedMediaType', 'screen'],
                    ['waitDelay', '5s'],
                    ['waitForExpression', "document.readyState === 'complete'"],
                    ['waitForSelector', '#ready-node'],
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
                    ]
                ]);
            });
        });
    });
});
