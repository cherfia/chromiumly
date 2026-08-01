import { appendPdfEnginePermissions } from '../pdf-engine-encryption.utils';

describe('appendPdfEnginePermissions', () => {
    it('appends nothing when permissions are undefined', () => {
        const data = new FormData();
        appendPdfEnginePermissions(data);
        expect([...data.entries()]).toEqual([]);
    });

    it('appends nothing when no fields are set', () => {
        const data = new FormData();
        appendPdfEnginePermissions(data, {});
        expect([...data.entries()]).toEqual([]);
    });

    it('appends only the fields that are explicitly set', () => {
        const data = new FormData();
        appendPdfEnginePermissions(data, {
            allowPrinting: false,
            allowAssembling: true
        });
        expect([...data.entries()]).toEqual([
            ['allowPrinting', 'false'],
            ['allowAssembling', 'true']
        ]);
    });

    it('appends every permission field when all are set', () => {
        const data = new FormData();
        appendPdfEnginePermissions(data, {
            allowPrinting: true,
            allowCopying: false,
            allowModifying: true,
            allowAnnotating: false,
            allowFillingForms: true,
            allowAssembling: false
        });
        expect([...data.entries()]).toEqual([
            ['allowPrinting', 'true'],
            ['allowCopying', 'false'],
            ['allowModifying', 'true'],
            ['allowAnnotating', 'false'],
            ['allowFillingForms', 'true'],
            ['allowAssembling', 'false']
        ]);
    });
});
