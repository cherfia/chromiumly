export type Currency =
    | 'USD' // $
    | 'EUR' // €
    | 'GBP' // £
    | 'JPY' // ¥
    | 'CNY' // ¥
    | 'CHF' // CHF
    | 'CAD' // $
    | 'AUD' // $
    | 'INR' // ₹
    | 'BRL' // R$
    | 'MXN' // $
    | 'SGD' // $
    | 'HKD' // $
    | 'NOK' // kr
    | 'SEK' // kr
    | 'DKK' // kr
    | 'NZD' // $
    | 'ZAR' // R
    | 'AED' // د.إ
    | 'SAR' // ﷼
    | 'KWD' // د.ك
    | 'QAR' // ﷼
    | 'BHD' // .د.ب
    | 'OMR' // ﷼
    | 'JOD' // د.ا
    | 'EGP' // £
    | 'MAD' // د.م.
    | 'TND' // د.ت
    | 'NGN' // ₦
    | 'KES' // KSh
    | 'GHS' // ₵
    | 'TZS' // TSh
    | 'UGX' // USh
    | 'ETB' // Br
    | 'XOF' // CFA
    | 'XAF' // CFA
    | 'TRY' // ₺
    | 'RUB' // ₽
    | 'PLN' // zł
    | 'CZK' // Kč
    | 'HUF' // Ft
    | 'RON' // lei
    | 'BGN' // лв
    | 'HRK' // kn
    | 'RSD' // din
    | 'UAH' // ₴
    | 'ILS' // ₪
    | 'PKR' // ₨
    | 'BDT' // ৳
    | 'LKR' // ₨
    | 'NPR' // ₨
    | 'MMK' // K
    | 'THB' // ฿
    | 'VND' // ₫
    | 'IDR' // Rp
    | 'MYR' // RM
    | 'PHP' // ₱
    | 'KRW' // ₩
    | 'TWD' // NT$
    | 'MNT' // ₮
    | 'KZT' // ₸
    | 'UZS' // so'm
    | 'GEL' // ₾
    | 'AMD' // ֏
    | 'AZN' // ₼
    | 'IRR' // ﷼
    | 'IQD' // ع.د
    | 'CLP' // $
    | 'COP' // $
    | 'ARS' // $
    | 'PEN' // S/
    | 'UYU' // $U
    | 'BOB' // Bs.
    | 'PYG' // ₲
    | 'VES' // Bs.S
    | 'CRC' // ₡
    | 'GTQ' // Q
    | 'HNL' // L
    | 'NIO' // C$
    | 'DOP' // RD$
    | 'CUP' // ₱
    | 'JMD' // J$
    | 'TTD' // TT$
    | 'BBD' // $
    | 'XCD'; // $

export type TemplateType =
    | 'invoice_freelancer'
    | 'invoice_saas'
    | 'invoice_classic'
    | 'invoice_minimal'
    | 'invoice_modern';

export interface TemplateParty {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    tax?: string;
    iban?: string;
    bic?: string;
}

export interface InvoiceItem {
    description: string;
    qty: number;
    unitPrice: string;
    amount: string;
}

export interface InvoiceSaasTemplateData {
    invoiceNumber: string;
    createdDate: string;
    dueDate: string;
    companyLogo?: string;
    sender: TemplateParty;
    receiver: TemplateParty;
    items: InvoiceItem[];
    currency: Currency;
    subTotal: string;
    taxRate: number;
    taxAmount: string;
    total: string;
    footerNote: string;
    footerDisclaimer?: string;
}

export interface InvoiceClassicTemplateData extends Omit<
    InvoiceSaasTemplateData,
    'companyLogo'
> {
    companyLogo: string;
}

export interface TemplateDataByType {
    invoice_saas: InvoiceSaasTemplateData;
    invoice_freelancer: InvoiceSaasTemplateData;
    invoice_classic: InvoiceClassicTemplateData;
    invoice_minimal: InvoiceSaasTemplateData;
    invoice_modern: InvoiceSaasTemplateData;
}

export type TemplateRequest<TType extends TemplateType> = {
    type: TType;
    data: TemplateDataByType[TType];
};
