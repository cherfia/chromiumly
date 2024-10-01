// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';

import FormData from 'form-data';
import fetch from 'node-fetch';

import { MarkdownScreenshot } from '../markdown.screenshot';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('MarkdownScreenshot', () => {
    const screenshot = new MarkdownScreenshot();

    describe('endpoint', () => {
        it('should route to Chromium Markdown route', () => {
            expect(screenshot.endpoint).toEqual(
                'http://localhost:3000/forms/chromium/screenshot/markdown'
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

        describe('when html and markdown parameters are passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown')
                });
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when image properties parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    properties: { format: 'jpeg', quality: 50 }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    emulatedMediaType: 'screen'
                });

                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when failOnHttpStatusCodes parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    failOnHttpStatusCodes: [499, 599]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when skipNetworkIdleEvent parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    skipNetworkIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await screenshot.capture({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    emulatedMediaType: 'screen',
                    failOnHttpStatusCodes: [499, 599],
                    skipNetworkIdleEvent: false,
                    failOnConsoleExceptions: true,
                    properties: { format: 'jpeg', quality: 50 },
                    optimizeForSpeed: true,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(10);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when file does not exist', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    "ENOENT: no such file or directory, access 'path/to/index.html'";
                mockPromisesAccess.mockRejectedValue(new Error(errorMessage));

                await expect(() =>
                    screenshot.capture({
                        html: 'path/to/index.html',
                        markdown: 'path/to/file.md'
                    })
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
                    screenshot.capture({
                        html: 'path/to/index.html',
                        markdown: 'path/to/file.md'
                    })
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
