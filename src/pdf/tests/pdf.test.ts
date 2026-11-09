import { promises } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import { PDF } from '../pdf';

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

const endpoint = (route: string) => `http://localhost:3000/forms/pdf/${route}`;

describe('PDF', () => {
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');

    const fields = () =>
        mockFormDataAppend.mock.calls.filter(([field]) => field !== 'files');

    const uploadedNames = () =>
        mockFormDataAppend.mock.calls
            .filter(([field]) => field === 'files')
            .map((call) => call[2]);

    beforeEach(() => {
        jest.clearAllMocks();
        mockPromisesAccess.mockResolvedValue();
        mockFetch.mockImplementation(() => Promise.resolve(mockResponse()));
    });

    describe('pipe', () => {
        it('should post the files and the stages to the pipe route', async () => {
            const buffer = await PDF.pipe({
                files: ['path/to/report.pdf'],
                stages: [
                    { op: 'select', pages: '1-2' },
                    { op: 'stamp-text', text: 'DRAFT', x: 72, y: 72 },
                    { op: 'optimize' }
                ]
            });

            expect(buffer).toEqual(await getResponseBuffer());
            expect(mockFetch).toHaveBeenCalledWith(
                endpoint('pipe'),
                expect.objectContaining({ method: 'POST' })
            );
            expect(fields()).toEqual([
                [
                    'stages',
                    JSON.stringify([
                        { op: 'select', pages: '1-2' },
                        { op: 'stamp-text', text: 'DRAFT', x: 72, y: 72 },
                        { op: 'optimize' }
                    ])
                ]
            ]);
            expect(uploadedNames()).toEqual(['report.pdf']);
        });

        it('should upload the files the stages name', async () => {
            await PDF.pipe({
                files: ['path/to/contract.pdf'],
                stages: [
                    {
                        op: 'sign',
                        certificate: 'path/to/cert.p12',
                        certificatePassword: 'secret'
                    }
                ]
            });
            expect(uploadedNames().sort()).toEqual([
                'cert.p12',
                'contract.pdf'
            ]);
        });

        it('should throw an error when no stage is passed', async () => {
            await expect(
                PDF.pipe({ files: ['path/to/report.pdf'], stages: [] })
            ).rejects.toThrow('At least one stage must be provided');
        });

        it('should send the webhook and output headers', async () => {
            await PDF.pipe({
                files: ['path/to/report.pdf'],
                stages: [{ op: 'merge' }],
                webhook: {
                    webhookUrl: 'https://example.com/upload',
                    webhookEventsUrl: 'https://example.com/events',
                    webhookMethod: 'PUT',
                    webhookExtraHttpHeaders: { Authorization: 'Bearer test' }
                },
                outputFilename: 'my-file',
                trace: 'my-trace-id'
            });
            expect(mockFetch).toHaveBeenCalledWith(
                endpoint('pipe'),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Gotenberg-Webhook-Url': 'https://example.com/upload',
                        'Gotenberg-Webhook-Events-Url':
                            'https://example.com/events',
                        'Gotenberg-Webhook-Method': 'PUT',
                        'Gotenberg-Webhook-Extra-Http-Headers': JSON.stringify({
                            Authorization: 'Bearer test'
                        }),
                        'Gotenberg-Output-Filename': 'my-file',
                        'Gotenberg-Trace': 'my-trace-id'
                    })
                })
            );
        });

        it('should accept PDFs from downloadFrom and archives only', async () => {
            await PDF.pipe({
                downloadFrom: { url: 'https://example.com/report.pdf' },
                archives: [Buffer.from('zip')],
                stages: [{ op: 'flatten-form' }]
            });
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'downloadFrom',
                JSON.stringify([{ url: 'https://example.com/report.pdf' }])
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'archives',
                expect.any(Blob),
                'archive1.zip'
            );
            expect(uploadedNames()).toEqual([]);
        });
    });

    describe('single-stage routes', () => {
        const files = ['path/to/report.pdf'];

        it.each([
            ['merge', () => PDF.merge({ files })],
            ['split', () => PDF.split({ files, every: 2 })],
            ['select', () => PDF.select({ files, pages: '1-2' })],
            ['delete', () => PDF.delete({ files, pages: 'last' })],
            [
                'insert',
                () => PDF.insert({ files, source: 'path/to/annex.pdf', at: 1 })
            ],
            [
                'compose',
                () =>
                    PDF.compose({
                        files,
                        paperSize: 'A4',
                        placements: [{ x: 0, y: 0 }]
                    })
            ],
            ['rotate', () => PDF.rotate({ files, angle: 90 })],
            ['stamp-text', () => PDF.stampText({ files, text: 'DRAFT' })],
            [
                'stamp-image',
                () => PDF.stampImage({ files, image: 'path/to/logo.png' })
            ],
            [
                'stamp-pdf',
                () => PDF.stampPdf({ files, source: 'path/to/seal.pdf' })
            ],
            ['set-metadata', () => PDF.setMetadata({ files, title: 'Report' })],
            [
                'set-bookmarks',
                () =>
                    PDF.setBookmarks({
                        files,
                        bookmarks: [{ title: 'Intro', pageNumber: 1 }]
                    })
            ],
            [
                'set-form',
                () => PDF.setForm({ files, fields: { name: 'Jane' } })
            ],
            ['flatten-form', () => PDF.flattenForm({ files })],
            ['flatten-transparency', () => PDF.flattenTransparency({ files })],
            [
                'convert-colors',
                () => PDF.convertColors({ files, target: 'gray' })
            ],
            [
                'redact',
                () =>
                    PDF.redact({
                        files,
                        regions: [
                            { page: 1, x: 0, y: 0, width: 10, height: 10 }
                        ]
                    })
            ],
            ['autotag', () => PDF.autotag({ files })],
            ['attach', () => PDF.attach({ files, file: 'path/to/data.xml' })],
            ['detach', () => PDF.detach({ files, name: 'data.xml' })],
            ['extract-attachments', () => PDF.extractAttachments({ files })],
            ['extract-text', () => PDF.extractText({ files, pages: '1' })],
            ['optimize', () => PDF.optimize({ files, dedup: false })],
            ['encrypt', () => PDF.encrypt({ files, userPassword: 'secret' })],
            ['decrypt', () => PDF.decrypt({ files, password: 'secret' })],
            ['remediate', () => PDF.remediate({ files, profile: 'PDF/A-2b' })],
            [
                'sign',
                () => PDF.sign({ files, certificate: 'path/to/cert.p12' })
            ],
            [
                'timestamp',
                () =>
                    PDF.timestamp({
                        files,
                        timestampUrl: 'https://freetsa.org/tsr'
                    })
            ],
            ['render', () => PDF.render({ files, format: 'jpeg' })]
        ])('should post %s to its own route', async (route, call) => {
            const buffer = await call();
            expect(buffer).toEqual(await getResponseBuffer());
            expect(mockFetch).toHaveBeenCalledWith(
                endpoint(route),
                expect.objectContaining({ method: 'POST' })
            );
            expect(mockFormDataAppend).not.toHaveBeenCalledWith(
                'stages',
                expect.anything()
            );
        });

        it('should append the options as form fields', async () => {
            await PDF.stampText({
                files,
                text: 'DRAFT',
                x: 72,
                y: 72,
                fontSize: 24,
                font: 'Helvetica-Bold',
                color: '#ff0000',
                opacity: 0.5,
                rotation: 45,
                pages: 'odd,!1'
            });
            expect(fields()).toEqual([
                ['text', 'DRAFT'],
                ['x', '72'],
                ['y', '72'],
                ['fontSize', '24'],
                ['font', 'Helvetica-Bold'],
                ['color', '#ff0000'],
                ['opacity', '0.5'],
                ['rotation', '45'],
                ['pages', 'odd,!1']
            ]);
        });

        it('should append lists and objects as JSON', async () => {
            await PDF.encrypt({
                files,
                userPassword: 'secret',
                permissions: { print: false, extractText: false }
            });
            expect(fields()).toEqual([
                ['userPassword', 'secret'],
                [
                    'permissions',
                    JSON.stringify({ print: false, extractText: false })
                ]
            ]);
        });

        it('should name a stage file and upload it with the PDFs', async () => {
            await PDF.remediate({
                files,
                profile: ['Factur-X', 'PDF/UA-1'],
                xml: { file: Buffer.from('<xml/>'), name: 'factur-x.xml' },
                level: 'EN 16931'
            });
            expect(fields()).toEqual([
                ['profile', JSON.stringify(['Factur-X', 'PDF/UA-1'])],
                ['xml', 'factur-x.xml'],
                ['level', 'EN 16931']
            ]);
            expect(uploadedNames().sort()).toEqual([
                'factur-x.xml',
                'report.pdf'
            ]);
        });

        it('should not send request options as form fields', async () => {
            await PDF.rotate({
                files,
                angle: -90,
                downloadFrom: { url: 'https://example.com/a.pdf' },
                webhook: {
                    webhookUrl: 'https://example.com/upload',
                    webhookEventsUrl: 'https://example.com/events'
                },
                outputFilename: 'rotated',
                trace: 'my-trace-id'
            });
            expect(fields()).toEqual([
                ['angle', '-90'],
                [
                    'downloadFrom',
                    JSON.stringify([{ url: 'https://example.com/a.pdf' }])
                ]
            ]);
            expect(mockFetch).toHaveBeenCalledWith(
                endpoint('rotate'),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Gotenberg-Webhook-Url': 'https://example.com/upload',
                        'Gotenberg-Output-Filename': 'rotated',
                        'Gotenberg-Trace': 'my-trace-id'
                    })
                })
            );
        });

        it('should throw an error when split has both or neither of every and ranges', async () => {
            await expect(PDF.split({ files })).rejects.toThrow(
                'Exactly one of every or ranges must be provided'
            );
            await expect(
                PDF.split({ files, every: 2, ranges: ['1'] })
            ).rejects.toThrow(
                'Exactly one of every or ranges must be provided'
            );
        });

        it('should throw an error when encrypt has no password', async () => {
            await expect(
                PDF.encrypt({ files, permissions: { print: false } })
            ).rejects.toThrow(
                'At least one of userPassword or ownerPassword must be provided'
            );
        });

        it('should reject a file that is not a PDF', async () => {
            await expect(
                PDF.merge({ files: ['path/to/file.docx'] })
            ).rejects.toThrow('.docx is not supported');
        });
    });

    describe('read routes', () => {
        const files = ['path/to/report.pdf'];
        const mockJson = (body: unknown) =>
            mockFetch.mockImplementation(() =>
                Promise.resolve(new Response(JSON.stringify(body)))
            );

        it('should parse the info answer', async () => {
            const info = {
                'report.pdf': {
                    pages: 3,
                    version: '1.7',
                    encrypted: false,
                    tagged: false,
                    linearized: false,
                    formFields: false
                }
            };
            mockJson(info);
            await expect(PDF.info({ files })).resolves.toEqual(info);
            expect(mockFetch).toHaveBeenCalledWith(
                endpoint('info'),
                expect.anything()
            );
        });

        it.each([
            ['metadata', () => PDF.metadata({ files })],
            ['bookmarks', () => PDF.bookmarks({ files })],
            ['attachments', () => PDF.attachments({ files })],
            ['form', () => PDF.form({ files })]
        ])('should post %s to its route', async (route, call) => {
            mockJson({ 'report.pdf': [] });
            await expect(call()).resolves.toEqual({ 'report.pdf': [] });
            expect(mockFetch).toHaveBeenCalledWith(
                endpoint(route),
                expect.anything()
            );
            expect(fields()).toEqual([]);
        });

        it('should send the password and the trace', async () => {
            mockJson({});
            await PDF.metadata({
                files,
                password: 'secret',
                trace: 'my-trace-id'
            });
            expect(fields()).toEqual([['password', 'secret']]);
            expect(mockFetch).toHaveBeenCalledWith(
                endpoint('metadata'),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Gotenberg-Trace': 'my-trace-id'
                    })
                })
            );
        });

        it('should send the pages of the form route', async () => {
            mockJson({});
            await PDF.form({ files, pages: '2' });
            expect(fields()).toEqual([['pages', '2']]);
        });

        it('should send a single validation profile as is', async () => {
            mockJson({});
            await PDF.validate({ files, profile: 'PDF/A-3b' });
            expect(fields()).toEqual([['profile', 'PDF/A-3b']]);
        });

        it('should send paired validation profiles as JSON', async () => {
            mockJson({});
            await PDF.validate({ files, profile: ['PDF/A-2b', 'PDF/UA-1'] });
            expect(fields()).toEqual([
                ['profile', JSON.stringify(['PDF/A-2b', 'PDF/UA-1'])]
            ]);
        });
    });

    describe('generate', () => {
        it('should generate a PDF file', async () => {
            const mockFilename = 'test.pdf';
            const mockBuffer = Buffer.from('mock pdf content');
            const mockMkdir = jest.spyOn(fs, 'mkdir').mockResolvedValue('');
            const mockWriteFile = jest
                .spyOn(fs, 'writeFile')
                .mockResolvedValue();

            await PDF.generate(mockFilename, mockBuffer);

            const generatedDir = path.resolve(process.cwd(), '__generated__');
            expect(mockMkdir).toHaveBeenCalledWith(generatedDir, {
                recursive: true
            });
            expect(mockWriteFile).toHaveBeenCalledWith(
                path.resolve(generatedDir, mockFilename),
                mockBuffer
            );
        });
    });
});
