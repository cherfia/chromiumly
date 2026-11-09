import { promises } from 'fs';

import { LibreOffice } from '../libre-office';

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
                    properties: {
                        landscape: true,
                        password: 'password',
                        paperSize: 'A4'
                    },
                    nativePdfa: 'PDF/A-2b',
                    nativePdfua: 'PDF/UA-1',
                    nativeLosslessImageCompression: true,
                    nativeReduceImageResolution: true,
                    nativeQuality: 50,
                    nativeMaxImageResolution: 75,
                    downloadFrom: {
                        url: 'http://example.com',
                        extraHttpHeaders: { 'Content-Type': 'application/json' }
                    },
                    stages: [
                        { op: 'merge' },
                        { op: 'encrypt', userPassword: 'my_user_password' }
                    ]
                });
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFormDataAppend).toHaveBeenCalledTimes(13);
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'stages',
                    JSON.stringify([
                        { op: 'merge' },
                        { op: 'encrypt', userPassword: 'my_user_password' }
                    ])
                );
                expect(mockFormDataAppend).toHaveBeenCalledWith(
                    'downloadFrom',
                    JSON.stringify([
                        {
                            url: 'http://example.com',
                            extraHttpHeaders: {
                                'Content-Type': 'application/json'
                            }
                        }
                    ])
                );
            });
        });

        describe('when a stage names a file', () => {
            it('should upload it next to the documents', async () => {
                mockPromisesAccess.mockResolvedValue();
                await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    stages: [
                        {
                            op: 'stamp-pdf',
                            source: {
                                file: Buffer.from('pdf'),
                                name: 'letterhead.pdf'
                            }
                        }
                    ]
                });
                expect(
                    mockFormDataAppend.mock.calls
                        .filter(([field]) => field === 'files')
                        .map((call) => call[2])
                ).toEqual(['file01.docx', 'letterhead.pdf']);
            });
        });

        describe('when webhook parameter is passed', () => {
            it('should send the webhook headers', async () => {
                mockPromisesAccess.mockResolvedValue();
                await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    webhook: {
                        webhookUrl: 'https://example.com/upload',
                        webhookEventsUrl: 'https://example.com/events'
                    }
                });
                expect(mockFetch).toHaveBeenCalledWith(
                    'http://localhost:3000/forms/libreoffice/convert',
                    expect.objectContaining({
                        headers: expect.objectContaining({
                            'Gotenberg-Webhook-Url':
                                'https://example.com/upload',
                            'Gotenberg-Webhook-Events-Url':
                                'https://example.com/events'
                        })
                    })
                );
            });
        });

        describe('when outputFilename and trace parameters are passed', () => {
            it('should send them as request headers', async () => {
                mockPromisesAccess.mockResolvedValue();
                await LibreOffice.convert({
                    files: ['path/to/file.docx'],
                    outputFilename: 'my-file',
                    trace: 'my-trace-id'
                });
                expect(mockFetch).toHaveBeenCalledWith(
                    'http://localhost:3000/forms/libreoffice/convert',
                    expect.objectContaining({
                        headers: expect.objectContaining({
                            'Gotenberg-Output-Filename': 'my-file',
                            'Gotenberg-Trace': 'my-trace-id'
                        })
                    })
                );
            });
        });
    });
});
