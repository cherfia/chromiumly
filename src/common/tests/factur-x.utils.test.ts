import { openAsBlob, promises, ReadStream } from 'fs';
import { blob } from 'node:stream/consumers';

import { appendFacturX } from '../factur-x.utils';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    openAsBlob: jest.fn().mockResolvedValue(new Blob(['file content']))
}));

jest.mock('node:stream/consumers', () => ({
    blob: jest.fn().mockResolvedValue(new Blob(['stream content']))
}));

describe('appendFacturX', () => {
    const mockFormDataAppend = jest.spyOn(FormData.prototype, 'append');
    const mockPromisesAccess = jest.spyOn(promises, 'access');
    const data = new FormData();

    beforeEach(() => {
        jest.clearAllMocks();
        mockPromisesAccess.mockResolvedValue();
        (openAsBlob as jest.Mock).mockResolvedValue(new Blob(['file content']));
        (blob as jest.Mock).mockResolvedValue(new Blob(['stream content']));
    });

    it('should append nothing when facturx is undefined', async () => {
        await appendFacturX(data);
        expect(mockFormDataAppend).not.toHaveBeenCalled();
    });

    it('should append the required fields with a Buffer XML file', async () => {
        const buf = Buffer.from('<xml/>');
        await appendFacturX(data, {
            facturxXml: buf,
            facturxConformanceLevel: 'EN 16931'
        });
        expect(mockFormDataAppend).toHaveBeenCalledWith(
            'facturxXml',
            new Blob([buf]),
            'factur-x.xml'
        );
        expect(mockFormDataAppend).toHaveBeenCalledWith(
            'facturxConformanceLevel',
            'EN 16931'
        );
        expect(mockFormDataAppend).toHaveBeenCalledTimes(2);
    });

    it('should append the XML file from a ReadStream', async () => {
        const mockReadStream = {
            pipe: jest.fn(),
            on: jest.fn(),
            read: jest.fn(),
            [Symbol.toStringTag]: 'ReadStream'
        } as unknown as ReadStream;
        Object.setPrototypeOf(mockReadStream, ReadStream.prototype);
        const mockBlob = new Blob(['rs']);
        (blob as jest.Mock).mockResolvedValue(mockBlob);

        await appendFacturX(data, {
            facturxXml: mockReadStream,
            facturxConformanceLevel: 'BASIC'
        });
        expect(blob).toHaveBeenCalledWith(mockReadStream);
        expect(mockFormDataAppend).toHaveBeenCalledWith(
            'facturxXml',
            mockBlob,
            'factur-x.xml'
        );
    });

    it('should append the XML file from a filesystem path using its own filename', async () => {
        await appendFacturX(data, {
            facturxXml: '/tmp/invoice.xml',
            facturxConformanceLevel: 'BASIC'
        });
        expect(mockPromisesAccess).toHaveBeenCalled();
        expect(mockFormDataAppend).toHaveBeenCalledWith(
            'facturxXml',
            expect.any(Blob),
            'invoice.xml'
        );
    });

    it('should append all optional fields when provided', async () => {
        await appendFacturX(data, {
            facturxXml: Buffer.from('<xml/>'),
            facturxConformanceLevel: 'XRECHNUNG',
            facturxDocumentType: 'ORDER',
            facturxVersion: '1.0',
            pdfa: 'PDF/A-3b',
            pdfUA: true
        });
        expect(mockFormDataAppend).toHaveBeenCalledWith(
            'facturxDocumentType',
            'ORDER'
        );
        expect(mockFormDataAppend).toHaveBeenCalledWith(
            'facturxVersion',
            '1.0'
        );
        expect(mockFormDataAppend).toHaveBeenCalledWith('pdfa', 'PDF/A-3b');
        expect(mockFormDataAppend).toHaveBeenCalledWith('pdfua', 'true');
    });
});
