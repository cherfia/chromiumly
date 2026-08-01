import { PdfFormat } from '../constants';

describe('PdfFormat', () => {
    it('supports every pdf/a format currently documented by gotenberg', () => {
        expect(PdfFormat.A_1b).toBe('PDF/A-1b');
        expect(PdfFormat.A_2b).toBe('PDF/A-2b');
        expect(PdfFormat.A_3b).toBe('PDF/A-3b');
    });

    it('keeps the deprecated pdf/a-1a value for backward compatibility', () => {
        expect(PdfFormat.A_1a).toBe('PDF/A-1a');
    });
});
