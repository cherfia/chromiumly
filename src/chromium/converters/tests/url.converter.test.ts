// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream } from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

import { PdfFormat } from '../../../common';
import { UrlConverter } from '../url.converter';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('HtmlConverter', () => {
    const converter = new UrlConverter();

    describe('endpoint', () => {
        it('should route to Chromium HTML route', () => {
            expect(converter.endpoint).toEqual(
                'http://localhost:3000/forms/chromium/convert/url'
            );
        });
    });

    describe('convert', () => {
        const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
        const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

        beforeEach(() => {
            (createReadStream as jest.Mock) = jest.fn();
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        describe('when URL is valid', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValueOnce(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/'
                });
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when header parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValueOnce(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    header: Buffer.from('header')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when footer parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValueOnce(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    footer: Buffer.from('footer')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when pdf format parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValueOnce(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    pdfFormat: PdfFormat.A_3b
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when page properties parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValueOnce(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    properties: { size: { width: 8.3, height: 11.7 } }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    emulatedMediaType: 'screen'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when failOnHttpStatusCodes parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    failOnHttpStatusCodes: [499, 599]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when skipNetworkIdleEvent parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    skipNetworkIdleEvent: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when downloadFrom parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });
        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
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
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(8);
                expect(buffer).toEqual(Buffer.from('content'));
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
                    'FetchError: request to http://localhost:3000/forms/chromium/convert/html failed';
                mockFetch.mockRejectedValueOnce(new Error(errorMessage));
                await expect(() =>
                    converter.convert({ url: 'http://www.example.com/' })
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
