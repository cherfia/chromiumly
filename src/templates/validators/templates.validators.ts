import {
    InvoiceClassicTemplateData,
    InvoiceSaasTemplateData,
    TemplateDataByType,
    TemplateType
} from '../interfaces/templates.types';

type Validator<T> = (data: unknown) => data is T;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const hasString = (obj: Record<string, unknown>, key: string): boolean =>
    typeof obj[key] === 'string' && obj[key] !== '';

const hasNumber = (obj: Record<string, unknown>, key: string): boolean =>
    typeof obj[key] === 'number';

const isValidUrl = (value: unknown): boolean => {
    if (typeof value !== 'string' || value === '') return false;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const validateInvoiceSaas: Validator<InvoiceSaasTemplateData> = (
    data: unknown
): data is InvoiceSaasTemplateData => {
    if (!isObject(data)) {
        return false;
    }

    if (
        !hasString(data, 'invoiceNumber') ||
        !hasString(data, 'createdDate') ||
        !hasString(data, 'dueDate') ||
        !hasString(data, 'currency') ||
        !hasString(data, 'subTotal') ||
        !hasNumber(data, 'taxRate') ||
        !hasString(data, 'taxAmount') ||
        !hasString(data, 'total') ||
        !hasString(data, 'footerNote')
    ) {
        return false;
    }

    if (data.companyLogo !== undefined && !isValidUrl(data.companyLogo)) {
        return false;
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
        return false;
    }

    if (!isObject(data.sender) || !isObject(data.receiver)) {
        return false;
    }

    const validateParty = (party: Record<string, unknown>): boolean =>
        hasString(party, 'name') && hasString(party, 'addressLine1');

    if (
        !validateParty(data.sender as Record<string, unknown>) ||
        !validateParty(data.receiver as Record<string, unknown>)
    ) {
        return false;
    }

    return data.items.every((item) => {
        if (!isObject(item)) {
            return false;
        }

        return (
            hasString(item, 'description') &&
            hasNumber(item, 'qty') &&
            hasString(item, 'unitPrice') &&
            hasString(item, 'amount')
        );
    });
};

const validateInvoiceClassic: Validator<InvoiceClassicTemplateData> = (
    data: unknown
): data is InvoiceClassicTemplateData =>
    validateInvoiceSaas(data) &&
    isValidUrl((data as unknown as Record<string, unknown>)['companyLogo']);

export const templateValidators: {
    [T in TemplateType]?: Validator<TemplateDataByType[T]>;
} = {
    invoice_saas: validateInvoiceSaas,
    invoice_classic: validateInvoiceClassic
};
