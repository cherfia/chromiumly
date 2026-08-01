import type { PdfEnginePermissions } from './pdf-engine-encryption.types';

/**
 * Appends Gotenberg PDF permission form fields (`allowPrinting`, `allowCopying`,
 * `allowModifying`, `allowAnnotating`, `allowFillingForms`, `allowAssembling`).
 * Fields are only appended when explicitly set, letting Gotenberg apply its own defaults otherwise.
 */
export function appendPdfEnginePermissions(
    data: FormData,
    permissions?: PdfEnginePermissions
): void {
    if (!permissions) {
        return;
    }

    if (permissions.allowPrinting !== undefined) {
        data.append('allowPrinting', String(permissions.allowPrinting));
    }

    if (permissions.allowCopying !== undefined) {
        data.append('allowCopying', String(permissions.allowCopying));
    }

    if (permissions.allowModifying !== undefined) {
        data.append('allowModifying', String(permissions.allowModifying));
    }

    if (permissions.allowAnnotating !== undefined) {
        data.append('allowAnnotating', String(permissions.allowAnnotating));
    }

    if (permissions.allowFillingForms !== undefined) {
        data.append(
            'allowFillingForms',
            String(permissions.allowFillingForms)
        );
    }

    if (permissions.allowAssembling !== undefined) {
        data.append('allowAssembling', String(permissions.allowAssembling));
    }
}
