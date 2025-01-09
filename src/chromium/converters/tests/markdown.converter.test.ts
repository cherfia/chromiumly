// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';

import FormData from 'form-data';
import fetch from 'node-fetch';

import { PdfFormat } from '../../../common';
import { MarkdownConverter } from '../markdown.converter';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('MarkdownConverter', () => {
    const converter = new MarkdownConverter();

    describe('endpoint', () => {
        it('should route to Chromium Markdown route', () => {
            expect(converter.endpoint).toEqual(
                'http://localhost:3000/forms/chromium/convert/markdown'
            );
        });
    });

    describe('convert', () => {
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
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown')
                });
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when pdf format parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    pdfFormat: PdfFormat.A_2b
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when page properties parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    properties: { size: { width: 8.3, height: 11.7 } }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when header parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    header: Buffer.from('header')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when footer parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    footer: Buffer.from('footer')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
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
                const buffer = await converter.convert({
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
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    skipNetworkIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when downloadFrom parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when split parameter is passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    split: { mode: 'pages', span: '1-10' }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                expect(buffer).toEqual(Buffer.from('content'));
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockFetch.mockResolvedValue(new Response('content'));
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
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
                    converter.convert({
                        html: 'path/to/index.html',
                        markdown: 'path/to/file.md'
                    })
                ).rejects.toThrow(errorMessage);
            });
        });

        describe('when fetch request fails', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    'FetchError: request to http://localhost:3000/forms/chromium/convert/html failed';
                mockPromisesAccess.mockResolvedValue();
                mockFetch.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    converter.convert({
                        html: 'path/to/index.html',
                        markdown: 'path/to/file.md'
                    })
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
