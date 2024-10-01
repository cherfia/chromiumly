// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream } from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

import { UrlScreenshot } from './../url.screenshot';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('URLScreenshot', () => {
    const screenshot = new UrlScreenshot();

    describe('endpoint', () => {
        it('should route to Chromium HTML route', () => {
            expect(screenshot.endpoint).toEqual(
                'http://localhost:3000/forms/chromium/screenshot/url'
            );
        });
    });

    describe('capture', () => {
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
                const buffer = await screenshot.capture({
                    url: 'http://www.example.com/'
                });
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when image properties parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValueOnce(new Response('content'));
                const buffer = await screenshot.capture({
                    url: 'http://www.example.com/',
                    properties: { format: 'jpeg', quality: 50 }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
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
                const buffer = await screenshot.capture({
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
                const buffer = await screenshot.capture({
                    url: 'http://www.example.com/',
                    skipNetworkIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when optimizeForSpeed parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    url: 'http://www.example.com/',
                    optimizeForSpeed: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    url: 'http://www.example.com/',
                    emulatedMediaType: 'screen',
                    failOnHttpStatusCodes: [499, 599],
                    skipNetworkIdleEvent: false,
                    failOnConsoleExceptions: true,
                    properties: { format: 'jpeg', quality: 50 },
                    optimizeForSpeed: true,
                    cookies: [
                        {
                            name: 'cookie',
                            value: 'value',
                            domain: 'example.com'
                        }
                    ]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(9);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when URL is invalid', () => {
            it('should throw an error', async () => {
                await expect(() =>
                    screenshot.capture({ url: 'invalid url' })
                ).rejects.toThrow('Invalid URL');
            });
        });

        describe('when fetch request fails', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    'FetchError: request to http://localhost:3000/forms/chromium/convert/html failed';
                mockFetch.mockRejectedValueOnce(new Error(errorMessage));
                await expect(() =>
                    screenshot.capture({ url: 'http://www.example.com/' })
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
