// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';

import { PdfFormat } from '../../../common';
import { MarkdownConverter } from '../markdown.converter';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file content'])),
    createReadStream: jest.fn()
}));

const mockResponse = () => new Response('content');

const getResponseBuffer = async () => {
    const responseBuffer = await mockResponse().arrayBuffer();
    return Buffer.from(responseBuffer);
};

const mockFetch = jest
    .spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve(mockResponse()));

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
        const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

        beforeEach(() => {
            (createReadStream as jest.Mock) = jest
                .fn()
                .mockImplementation(() => ({
                    pipe: jest.fn(),
                    on: jest.fn(),
                    async *[Symbol.asyncIterator]() {
                        yield Buffer.from('file content');
                    }
                }));
            jest.clearAllMocks();
            mockFetch.mockImplementation(() => Promise.resolve(mockResponse()));
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        describe('when html and markdown parameters are passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when multiple markdown files are passed', () => {
            it('should append each file under its own name', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: [
                        { file: Buffer.from('md1'), name: 'part1.md' },
                        { file: Buffer.from('md2'), name: 'part2.md' }
                    ]
                });
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'files',
                    new Blob([Buffer.from('md1')]),
                    'part1.md'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'files',
                    new Blob([Buffer.from('md2')]),
                    'part2.md'
                );
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when assets parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    assets: [
                        { file: Buffer.from('asset1'), name: 'asset1' },
                        { file: Buffer.from('asset2'), name: 'asset2' }
                    ]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when pdf format parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    pdfFormat: PdfFormat.A_2b
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when page properties parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    properties: { size: { width: 8.3, height: 11.7 } }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when header parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    header: Buffer.from('header')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when footer parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    footer: Buffer.from('footer')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    emulatedMediaType: 'screen'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when failOnHttpStatusCodes parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    failOnHttpStatusCodes: [499, 599]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when skipNetworkIdleEvent parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    skipNetworkIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when downloadFrom parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when split parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    split: { mode: 'pages', span: '1-10', unify: true }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(5);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when outputFilename and trace parameters are passed', () => {
            it('should send them as request headers', async () => {
                mockPromisesAccess.mockResolvedValue();
                await converter.convert({
                    html: Buffer.from('data'),
                    markdown: Buffer.from('markdown'),
                    outputFilename: 'my-file',
                    trace: 'my-trace-id'
                });
                expect(mockFetch).toHaveBeenCalledWith(
                    converter.endpoint,
                    expect.objectContaining({
                        headers: expect.objectContaining({
                            'Gotenberg-Output-Filename': 'my-file',
                            'Gotenberg-Trace': 'my-trace-id'
                        })
                    })
                );
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();

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
                    },
                    split: { mode: 'pages', span: 'r3-r1' }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(11);
                expect(buffer).toEqual(await getResponseBuffer());
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
                    'FetchError: request to http://localhost:3000/forms/chromium/convert/markdown failed';
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
