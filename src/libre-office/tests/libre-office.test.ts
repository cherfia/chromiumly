// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { promises } from 'fs';

import { LibreOffice } from '../libre-office';
import { PdfFormat } from '../../common';

const mockResponse = () => new Response('content');

const getResponseBuffer = async () => {
    const responseBuffer = await mockResponse().arrayBuffer();
    return Buffer.from(responseBuffer);
};

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file content']))
}));

const mockFetch = jest
    .spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve(mockResponse()));

describe('LibreOffice', () => {
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockImplementation(() => Promise.resolve(mockResponse()));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('convert', () => {
        describe('when no properties are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx', 'path/to/file.bib']
                });
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
            });
        });

        describe('when properties are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx', 'path/to/file.bib'],
                    properties: { landscape: true, password: 'password' },
                    pdfa: PdfFormat.A_2b,
                    pdfUA: true,
                    metadata: { author: 'John Doe' },
                    merge: true,
                    losslessImageCompression: true,
                    reduceImageResolution: true,
                    quality: 50,
                    maxImageResolution: 75,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    },
                    split: {
                        mode: 'pages',
                        span: '1-10',
                        unify: true
                    },
                    flatten: true,
                    userPassword: 'my_user_password',
                    ownerPassword: 'my_owner_password'
                });
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFormDataAppend).toHaveBeenCalledTimes(18);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'userPassword',
                    'my_user_password'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'ownerPassword',
                    'my_owner_password'
                );
            });
        });

        describe('when userPassword parameter is passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    userPassword: 'my_user_password'
                });
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'userPassword',
                    'my_user_password'
                );
            });
        });

        describe('when ownerPassword parameter is passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    ownerPassword: 'my_owner_password'
                });
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'ownerPassword',
                    'my_owner_password'
                );
            });
        });

        describe('when both userPassword and ownerPassword are passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    userPassword: 'my_user_password',
                    ownerPassword: 'my_owner_password'
                });
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'userPassword',
                    'my_user_password'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'ownerPassword',
                    'my_owner_password'
                );
            });
        });

        describe('when embeds parameter is passed', () => {
            it('should return a buffer', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    embeds: ['path/to/embed.xml', 'path/to/embed.png']
                });
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFormDataAppend).toHaveBeenCalledTimes(3);
            });
        });

        describe('when rotate is passed', () => {
            it('should append rotateAngle and rotatePages', async () => {
                mockPromisesAccess.mockResolvedValue();
                await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    rotate: { angle: 270, pages: '2' }
                });
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'rotateAngle',
                    '270'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'rotatePages',
                    '2'
                );
            });
        });

        describe('when PDF-engine watermark and stamp are passed', () => {
            it('should append watermark and stamp form fields', async () => {
                mockPromisesAccess.mockResolvedValue();
                const buffer = await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    watermark: {
                        source: 'text',
                        expression: 'CONFIDENTIAL'
                    },
                    stamp: {
                        source: 'text',
                        expression: 'APPROVED',
                        pages: '1'
                    }
                });
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'watermarkSource',
                    'text'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'watermarkExpression',
                    'CONFIDENTIAL'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'stampSource',
                    'text'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'stampExpression',
                    'APPROVED'
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'stampPages',
                    '1'
                );
            });
        });
    });
});
