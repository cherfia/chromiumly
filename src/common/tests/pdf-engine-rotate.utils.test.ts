import { appendPdfEngineRotate } from '../pdf-engine-rotate.utils';

describe('appendPdfEngineRotate', () => {
    it('appends rotateAngle and rotatePages', () => {
        const data = new FormData();
        appendPdfEngineRotate(data, { angle: 90, pages: '1-3' });
        expect([...data.entries()]).toEqual([
            ['rotateAngle', '90'],
            ['rotatePages', '1-3']
        ]);
    });

    it('omits rotatePages when undefined or empty string', () => {
        const data = new FormData();
        appendPdfEngineRotate(data, { angle: 180 });
        expect([...data.entries()]).toEqual([['rotateAngle', '180']]);

        const data2 = new FormData();
        appendPdfEngineRotate(data2, { angle: 270, pages: '' });
        expect([...data2.entries()]).toEqual([['rotateAngle', '270']]);
    });

    it('throws for invalid angle', () => {
        const data = new FormData();
        expect(() =>
            appendPdfEngineRotate(data, {
                angle: 45 as unknown as 90
            })
        ).toThrow('rotate.angle must be 90, 180, or 270');
    });
});
