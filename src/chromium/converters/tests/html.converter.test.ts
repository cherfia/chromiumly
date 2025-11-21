// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createReadStream, promises } from 'fs';

import { PdfFormat } from '../../../common';
import { HtmlConverter } from '../html.converter';

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

describe('HtmlConverter', () => {
    const converter = new HtmlConverter();

    describe('endpoint', () => {
        it('should route to Chromium HTML route', () => {
            expect(converter.endpoint).toEqual(
                'http://localhost:3000/forms/chromium/convert/html'
            );
        });
    });

    describe('convert', () => {
        const mockPromisesAccess = jest.spyOn(promises, 'access');
        const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

        const assets = [
            { file: Buffer.from('asset1'), name: 'asset1' },
            { file: Buffer.from('asset2'), name: 'asset2' }
        ];

        beforeEach(() => {
            (createReadStream as jest.Mock) = jest.fn();
            jest.clearAllMocks();
            mockFetch.mockImplementation(() => Promise.resolve(mockResponse()));
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        describe('when html parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data')
                });
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when pdf format parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    pdfFormat: PdfFormat.A_1a
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when page properties parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    properties: { size: { width: 8.3, height: 11.7 } }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when header parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    header: Buffer.from('header')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when footer parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    footer: Buffer.from('footer')
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when assets parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    assets
                });

                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when emulatedMediaType parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    emulatedMediaType: 'screen'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when failOnHttpStatusCodes parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    failOnHttpStatusCodes: [499, 599]
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when skipNetworkIdleEvent parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    skipNetworkIdleEvent: false
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when downloadFrom parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
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
                    html: Buffer.from('data'),
                    split: { mode: 'pages', span: '1-10', unify: true }
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when userPassword parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    userPassword: 'my_user_password'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'userPassword',
                    'my_user_password'
                );
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when ownerPassword parameter is passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    ownerPassword: 'my_owner_password'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'ownerPassword',
                    'my_owner_password'
                );
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when both userPassword and ownerPassword are passed', () => {
            it('should return a buffer', async () => {
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    userPassword: 'my_user_password',
                    ownerPassword: 'my_owner_password'
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'userPassword',
                    'my_user_password'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'ownerPassword',
                    'my_owner_password'
                );
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when embeds parameter is passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    embeds: ['path/to/embed.xml', 'path/to/embed.png']
                });
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when all parameters are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();

                const buffer = await converter.convert({
                    html: Buffer.from('data'),
                    assets,
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
                expect(mockFormDataAppend).toHaveBeenCalledTimes(12);
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when file does not exist', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    "ENOENT: no such file or directory, access 'path/to/index.html'";
                mockPromisesAccess.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    converter.convert({ html: 'path/to/index.html' })
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
                    converter.convert({ html: 'path/to/index.html' })
                ).rejects.toThrow(errorMessage);
            });
        });
    });
});
