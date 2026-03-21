import { openAsBlob, promises, ReadStream } from 'fs';

import { blob } from 'node:stream/consumers';

import { PdfEngineWatermarkStampUtils } from '../pdf-engine-watermark-stamp.utils';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file content']))
}));

jest.mock('node:stream/consumers', () => ({
    blob: jest.fn().mockResolvedValue(new Blob(['stream content']))
}));

describe('PdfEngineWatermarkStampUtils', () => {
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const data = new FormData();

    beforeEach(() => {
        jest.clearAllMocks();
        mockPromisesAccess.mockResolvedValue();
        (openAsBlob as jest.Mock).mockResolvedValue(new Blob(['file content']));
        (blob as jest.Mock).mockResolvedValue(new Blob(['stream content']));
    });

    describe('appendPdfEngineWatermarkStamp', () => {
        it('should append text watermark fields and JSON options', async () => {
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                {
                    watermark: {
                        source: 'text',
                        expression: 'CONFIDENTIAL',
                        pages: '1-3',
                        options: { opacity: 0.25, rotation: 45 }
                    }
                }
            );
            expect(mockFormDataAppend).toHaveBeenCalledTimes(4);
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermarkSource',
                'text'
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermarkExpression',
                'CONFIDENTIAL'
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermarkPages',
                '1-3'
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermarkOptions',
                JSON.stringify({ opacity: 0.25, rotation: 45 })
            );
        });

        it('should append stamp fields', async () => {
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                {
                    stamp: {
                        source: 'text',
                        expression: 'APPROVED',
                        options: { opacity: 0.5 }
                    }
                }
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
                'stampOptions',
                JSON.stringify({ opacity: 0.5 })
            );
        });

        it('should append watermark file field for buffer', async () => {
            const buf = Buffer.from('png');
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                {
                    watermark: {
                        source: 'image',
                        expression: 'wm.png',
                        file: buf
                    }
                }
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermarkSource',
                'image'
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermarkExpression',
                'wm.png'
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermark',
                new Blob([buf]),
                'watermark'
            );
        });

        it('should append stamp file field for buffer', async () => {
            const buf = Buffer.from('stamp-png');
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                {
                    stamp: {
                        source: 'image',
                        expression: 's.png',
                        file: buf
                    }
                }
            );
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'stamp',
                new Blob([buf]),
                'stamp'
            );
        });

        it('should append watermark file from ReadStream', async () => {
            const mockReadStream = {
                pipe: jest.fn(),
                on: jest.fn(),
                read: jest.fn(),
                [Symbol.toStringTag]: 'ReadStream'
            } as unknown as ReadStream;
            Object.setPrototypeOf(mockReadStream, ReadStream.prototype);
            const mockBlob = new Blob(['rs']);
            (blob as jest.Mock).mockResolvedValue(mockBlob);

            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                {
                    watermark: {
                        source: 'pdf',
                        expression: 'layer.pdf',
                        file: mockReadStream
                    }
                }
            );
            expect(blob).toHaveBeenCalledWith(mockReadStream);
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermark',
                mockBlob,
                'watermark'
            );
        });

        it('should append stamp file from filesystem path', async () => {
            mockPromisesAccess.mockResolvedValue();
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                {
                    stamp: {
                        source: 'pdf',
                        expression: 'approved.pdf',
                        file: '/tmp/stamp.pdf'
                    }
                }
            );
            expect(mockPromisesAccess).toHaveBeenCalled();
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'stamp',
                expect.any(Blob),
                'stamp.pdf'
            );
        });

        it('should append only watermark file when scalar fields are omitted', async () => {
            const buf = Buffer.from('wm-only');
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                { watermark: { file: buf } }
            );
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'watermark',
                new Blob([buf]),
                'watermark'
            );
        });

        it('should append only stamp file when scalar fields are omitted', async () => {
            const buf = Buffer.from('st-only');
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                { stamp: { file: buf } }
            );
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            expect(mockFormDataAppend).toHaveBeenCalledWith(
                'stamp',
                new Blob([buf]),
                'stamp'
            );
        });

        it('should append stamp pages without other stamp fields', async () => {
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                { stamp: { pages: '2' } }
            );
            expect(mockFormDataAppend).toHaveBeenCalledTimes(1);
            expect(mockFormDataAppend).toHaveBeenCalledWith('stampPages', '2');
        });
    });
});
