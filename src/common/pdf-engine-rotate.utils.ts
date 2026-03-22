import { GotenbergUtils } from './gotenberg.utils';
import type { PdfEngineRotate } from './types';

const ROTATE_ANGLES = new Set(['90', '180', '270'] as const);

/**
 * Appends Gotenberg PDF-engine rotate form fields (`rotateAngle`, `rotatePages`).
 */
export function appendPdfEngineRotate(
    data: FormData,
    rotate: PdfEngineRotate
): void {
    const angle = String(rotate.angle);
    GotenbergUtils.assert(
        ROTATE_ANGLES.has(angle as '90' | '180' | '270'),
        'rotate.angle must be 90, 180, or 270'
    );
    data.append('rotateAngle', angle);
    if (rotate.pages !== undefined && rotate.pages !== '') {
        data.append('rotatePages', rotate.pages);
    }
}
