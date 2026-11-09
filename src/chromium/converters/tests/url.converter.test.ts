// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';

import { UrlConverter } from '../url.converter';

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
        const mockPromisesAccess = jest.spyOn(promises, 'access');

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

        describe('when outputFilename and trace parameters are passed', () => {
            it('should send them as request headers', async () => {
                await converter.convert({
                    url: 'http://www.example.com/',
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

        describe('when native parameters are passed', () => {
            it('should append them', async () => {
                await converter.convert({
                    url: 'http://www.example.com/',
                    nativeBookmarks: true,
                    nativeTaggedPdf: true
                });
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'nativeBookmarks',
                    'true'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'nativeTaggedPdf',
                    'true'
                );
            });
        });

        describe('when stages parameter is passed', () => {
            it('should append the stages and upload the files they name', async () => {
                mockPromisesAccess.mockResolvedValue();
                await converter.convert({
                    url: 'http://www.example.com/',
                    stages: [
                        { op: 'stamp-image', image: 'path/to/logo.png' },
                        { op: 'remediate', profile: 'PDF/A-3b' }
                    ]
                });
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'stages',
                    JSON.stringify([
                        { op: 'stamp-image', image: 'logo.png' },
                        { op: 'remediate', profile: 'PDF/A-3b' }
                    ])
                );
                expect(
                    mockFormDataAppend.mock.calls.map((call) => call[2])
                ).toContain('logo.png');
            });
        });

        describe('when archives parameter is passed', () => {
            it('should upload them under the archives field', async () => {
                await converter.convert({
                    url: 'http://www.example.com/',
                    archives: [Buffer.from('zip')]
                });
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'archives',
                    expect.anything(),
                    'archive1.zip'
                );
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();

                const buffer = await converter.convert({
                    url: 'http://www.example.com/',
                    header: Buffer.from('header'),
                    footer: Buffer.from('footer'),
                    emulatedMediaType: 'screen',
                    properties: { size: { width: 8.3, height: 11.7 } },
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    },
                    nativeBookmarks: true,
                    stages: [{ op: 'split', every: 2 }]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(9);
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
