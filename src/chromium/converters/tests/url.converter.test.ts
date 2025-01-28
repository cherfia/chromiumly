// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream } from 'fs';

import { PdfFormat } from '../../../common';
import { UrlConverter } from '../url.converter';

const mockResponse = () => new Response('content');

const getResponseBuffer = async () => {
    const responseBuffer = await mockResponse().arrayBuffer();
    return Buffer.from(responseBuffer);
};

const mockFetch = jest
    .spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve(mockResponse()));

describe('UrlConverter', () => {
    const converter = new UrlConverter();

    describe('endpoint', () => {
        it('should route to Chromium URL route', () => {
            expect(converter.endpoint).toEqual(
                'http://localhost:3000/forms/chromium/convert/url'
            );
        });
    });

    describe('convert', () => {
        const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

        beforeEach(() => {
            (createReadStream as jest.Mock) = jest.fn();
            jest.clearAllMocks();
            mockFetch.mockImplementation(() => Promise.resolve(mockResponse()));
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        describe('when URL is valid', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/'
                });
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when header parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    header: Buffer.from('header')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when footer parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    footer: Buffer.from('footer')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when pdf format parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    pdfFormat: PdfFormat.A_3b
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when page properties parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    properties: { size: { width: 8.3, height: 11.7 } }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    emulatedMediaType: 'screen'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when failOnHttpStatusCodes parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    failOnHttpStatusCodes: [499, 599]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when skipNetworkIdleEvent parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    skipNetworkIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when downloadFrom parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when split parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    split: { mode: 'intervals', span: '1' }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    header: Buffer.from('header'),
                    footer: Buffer.from('footer'),
                    pdfFormat: PdfFormat.A_1a,
                    emulatedMediaType: 'screen',
                    properties: { size: { width: 8.3, height: 11.7 } },
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    },
                    split: { mode: 'pages', span: 'r3-r1' }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(10);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when URL is invalid', () => {
            it('should throw an error', async () => {
                await expect(() =>
                    converter.convert({ url: 'invalid url' })
                ).rejects.toThrow('Invalid URL');
            });
        });

        describe('when fetch request fails', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    'FetchError: request to http://localhost:3000/forms/chromium/convert/url failed';
                mockFetch.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    converter.convert({ url: 'http://www.example.com/' })
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
