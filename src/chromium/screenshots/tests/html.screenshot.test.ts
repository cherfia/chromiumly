// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';

import fetch from 'node-fetch';
import FormData from 'form-data';

import { HtmlScreenshot } from '../html.screenshot';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('HtmlScreenshot', () => {
    const screenshot = new HtmlScreenshot();

    describe('endpoint', () => {
        it('should route to Chromium HTML route', () => {
            expect(screenshot.endpoint).toEqual(
                'http://localhost:3000/forms/chromium/screenshot/html'
            );
        });
    });

    describe('capture', () => {
        const mockPromisesAccess = jest.spyOn(promises, 'access');
        const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
        const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

        beforeEach(() => {
            (createReadStream as jest.Mock) = jest.fn();
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        describe('when html parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data')
                });
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when image properties parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
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
                    html: Buffer.from('data'),
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
                    html: Buffer.from('data'),
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
                    html: Buffer.from('data'),
                    skipNetworkIdleEvent: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when optimizeForSpeed parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    optimizeForSpeed: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    emulatedMediaType: 'screen',
                    failOnHttpStatusCodes: [499, 599],
                    skipNetworkIdleEvent: true,
                    failOnConsoleExceptions: true,
                    properties: { format: 'jpeg', quality: 50 },
                    optimizeForSpeed: true,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(9);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when file does not exist', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    "ENOENT: no such file or directory, access 'path/to/index.html'";
                mockPromisesAccess.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    screenshot.capture({ html: 'path/to/index.html' })
                ).rejects.toThrow(errorMessage);
            });
        });

        describe('when fetch request fails', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    'FetchError: request to http://localhost:3000/forms/chromium/screenshot/html failed';
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    screenshot.capture({ html: 'path/to/index.html' })
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
