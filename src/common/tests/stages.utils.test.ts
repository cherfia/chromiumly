import { promises } from 'fs';
import { pathToFileURL } from 'url';

import { StageUtils } from '../stages.utils';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file content']))
}));

describe('StageUtils', () => {
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const mockPromisesAccess = jest.spyOn(promises, 'access');

    const uploadedNames = () =>
        mockFormDataAppend.mock.calls
            .filter(([field]) => field === 'files')
            .map((call) => call[2])
            .sort();

    beforeEach(() => {
        jest.clearAllMocks();
        mockPromisesAccess.mockResolvedValue();
    });

    describe('appendStages', () => {
        it('should append nothing when no stage is passed', async () => {
            await StageUtils.appendStages(new FormData());
            await StageUtils.appendStages(new FormData(), []);
            expect(mockFormDataAppend).not.toHaveBeenCalled();
        });

        it('should append the stages as a JSON array, in order', async () => {
            await StageUtils.appendStages(new FormData(), [
                { op: 'merge' },
                { op: 'stamp-text', text: 'DRAFT', x: 72, y: 72 },
                { op: 'remediate', profile: ['PDF/A-2b', 'PDF/UA-1'] }
            ]);
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'stages',
                JSON.stringify([
                    { op: 'merge' },
                    { op: 'stamp-text', text: 'DRAFT', x: 72, y: 72 },
                    { op: 'remediate', profile: ['PDF/A-2b', 'PDF/UA-1'] }
                ])
            );
        });

        it('should upload the files stages name and reference them by name', async () => {
            await StageUtils.appendStages(new FormData(), [
                { op: 'stamp-image', image: 'path/to/logo.png' },
                {
                    op: 'stamp-pdf',
                    source: {
                        file: Buffer.from('pdf'),
                        name: 'letterhead.pdf'
                    }
                },
                { op: 'attach', file: { name: 'downloaded.xml' } },
                {
                    op: 'sign',
                    certificate: pathToFileURL('/certs/cert.pem'),
                    key: 'path/to/key.pem'
                }
            ]);

            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'stages',
                JSON.stringify([
                    { op: 'stamp-image', image: 'logo.png' },
                    { op: 'stamp-pdf', source: 'letterhead.pdf' },
                    { op: 'attach', file: 'downloaded.xml' },
                    { op: 'sign', certificate: 'cert.pem', key: 'key.pem' }
                ])
            );
            expect(uploadedNames()).toEqual([
                'cert.pem',
                'key.pem',
                'letterhead.pdf',
                'logo.png'
            ]);
        });

        it('should upload a file named by several stages once', async () => {
            await StageUtils.appendStages(new FormData(), [
                { op: 'insert', source: 'path/to/annex.pdf' },
                { op: 'stamp-pdf', source: 'path/to/annex.pdf' }
            ]);
            expect(uploadedNames()).toEqual(['annex.pdf']);
        });

        it('should resolve the sources of compose placements', async () => {
            await StageUtils.appendStages(new FormData(), [
                {
                    op: 'compose',
                    paperSize: 'A4',
                    placements: [
                        { source: 'path/to/label.pdf', x: 10, y: 20 },
                        { page: 2 }
                    ]
                }
            ]);
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'stages',
                JSON.stringify([
                    {
                        op: 'compose',
                        paperSize: 'A4',
                        placements: [
                            { source: 'label.pdf', x: 10, y: 20 },
                            { page: 2 }
                        ]
                    }
                ])
            );
            expect(uploadedNames()).toEqual(['label.pdf']);
        });

        it('should reject a stage file that cannot be read', async () => {
            mockPromisesAccess.mockRejectedValue(new Error('ENOENT'));
            await expect(
                StageUtils.appendStages(new FormData(), [
                    { op: 'stamp-image', image: 'path/to/missing.png' }
                ])
            ).rejects.toThrow('ENOENT');
        });
    });

    describe('appendStageFields', () => {
        it('should append each option as a form field, without the op', async () => {
            await StageUtils.appendStageFields(new FormData(), {
                op: 'stamp-text',
                text: 'DRAFT',
                fontSize: 24,
                pages: '1-2'
            });
            expect(mockFormDataAppend.mock.calls).toEqual([
                ['text', 'DRAFT'],
                ['fontSize', '24'],
                ['pages', '1-2']
            ]);
        });

        it('should append lists and objects as JSON and skip undefined options', async () => {
            await StageUtils.appendStageFields(new FormData(), {
                op: 'encrypt',
                userPassword: 'secret',
                ownerPassword: undefined,
                permissions: { print: false }
            });
            expect(mockFormDataAppend.mock.calls).toEqual([
                ['userPassword', 'secret'],
                ['permissions', JSON.stringify({ print: false })]
            ]);
        });

        it('should append file options by name and upload the files', async () => {
            await StageUtils.appendStageFields(new FormData(), {
                op: 'remediate',
                profile: 'Factur-X',
                xml: 'path/to/factur-x.xml',
                level: 'EN 16931'
            });
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'xml',
                'factur-x.xml'
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'level',
                'EN 16931'
            );
            expect(uploadedNames()).toEqual(['factur-x.xml']);
        });

        it('should append no field for a stage without options', async () => {
            await StageUtils.appendStageFields(new FormData(), {
                op: 'merge'
            });
            expect(mockFormDataAppend).not.toHaveBeenCalled();
        });
    });
});
