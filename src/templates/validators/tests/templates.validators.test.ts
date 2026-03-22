import { templateValidators } from '../templates.validators';

const validData = {
    invoiceNumber: 'INV-001',
    createdDate: '2024-01-01',
    dueDate: '2024-01-31',
    companyLogo: 'https://example.com/logo.png',
    sender: {
        name: 'Acme Corp',
        addressLine1: '123 Main St',
        addressLine2: 'New York, NY 10001'
    },
    receiver: {
        name: 'Client Inc',
        addressLine1: '456 Oak Ave',
        addressLine2: 'Los Angeles, CA 90001'
    },
    items: [
        {
            description: 'Service',
            qty: 10,
            unitPrice: '100.00',
            amount: '1000.00'
        }
    ],
    currency: 'USD',
    subTotal: '1000.00',
    taxRate: 10,
    taxAmount: '100.00',
    total: '1100.00',
    footerNote: 'Thank you for your business.',
    footerDisclaimer: 'All prices in USD.'
};

describe('templateValidators', () => {
    describe('invoice_saas', () => {
        const validate = templateValidators['invoice_saas']!;

        describe('when data is valid', () => {
            it('should return true', () => {
                expect(validate(validData)).toBe(true);
            });
        });

        describe('when data is not an object', () => {
            it('should return false', () => {
                expect(validate(null)).toBe(false);
                expect(validate('string')).toBe(false);
                expect(validate(42)).toBe(false);
            });
        });

        describe('when a required string field is missing', () => {
            it('should return false for empty invoiceNumber', () => {
                expect(validate({ ...validData, invoiceNumber: '' })).toBe(
                    false
                );
            });

            it('should return false for missing createdDate', () => {
                expect(validate({ ...validData, createdDate: '' })).toBe(false);
            });

            it('should return false for missing total', () => {
                expect(validate({ ...validData, total: '' })).toBe(false);
            });
        });

        describe('when companyLogo is present but not a valid URL', () => {
            it('should return false', () => {
                expect(
                    validate({ ...validData, companyLogo: 'not-a-url' })
                ).toBe(false);
            });
        });

        describe('when companyLogo is a valid URL', () => {
            it('should return true', () => {
                expect(
                    validate({
                        ...validData,
                        companyLogo: 'https://example.com/logo.png'
                    })
                ).toBe(true);
            });
        });

        describe('when taxRate is not a number', () => {
            it('should return false', () => {
                expect(validate({ ...validData, taxRate: '10%' })).toBe(false);
            });
        });

        describe('when items is empty', () => {
            it('should return false', () => {
                expect(validate({ ...validData, items: [] })).toBe(false);
            });
        });

        describe('when items is not an array', () => {
            it('should return false', () => {
                expect(validate({ ...validData, items: 'not-an-array' })).toBe(
                    false
                );
            });
        });

        describe('when sender is not an object', () => {
            it('should return false', () => {
                expect(validate({ ...validData, sender: null })).toBe(false);
                expect(validate({ ...validData, sender: 'string' })).toBe(
                    false
                );
            });
        });

        describe('when receiver is not an object', () => {
            it('should return false', () => {
                expect(validate({ ...validData, receiver: null })).toBe(false);
            });
        });

        describe('when a party field is missing', () => {
            it('should return false for missing sender name', () => {
                expect(
                    validate({
                        ...validData,
                        sender: { ...validData.sender, name: '' }
                    })
                ).toBe(false);
            });

            it('should return false for missing sender addressLine1', () => {
                expect(
                    validate({
                        ...validData,
                        sender: { ...validData.sender, addressLine1: '' }
                    })
                ).toBe(false);
            });

            it('should return false for missing receiver addressLine1', () => {
                expect(
                    validate({
                        ...validData,
                        receiver: { ...validData.receiver, addressLine1: '' }
                    })
                ).toBe(false);
            });
        });

        describe('when footerDisclaimer is omitted', () => {
            it('should return true', () => {
                const {
                    footerDisclaimer: _footerDisclaimer,
                    ...dataWithoutDisclaimer
                } = validData;
                expect(validate(dataWithoutDisclaimer)).toBe(true);
            });
        });

        describe('when an item is invalid', () => {
            it('should return false for missing description', () => {
                expect(
                    validate({
                        ...validData,
                        items: [
                            {
                                description: '',
                                qty: 10,
                                unitPrice: '100.00',
                                amount: '1000.00'
                            }
                        ]
                    })
                ).toBe(false);
            });

            it('should return false when qty is not a number', () => {
                expect(
                    validate({
                        ...validData,
                        items: [
                            {
                                description: 'Service',
                                qty: '10',
                                unitPrice: '100.00',
                                amount: '1000.00'
                            }
                        ]
                    })
                ).toBe(false);
            });

            it('should return false for missing unitPrice', () => {
                expect(
                    validate({
                        ...validData,
                        items: [
                            {
                                description: 'Service',
                                qty: 10,
                                unitPrice: '',
                                amount: '1000.00'
                            }
                        ]
                    })
                ).toBe(false);
            });

            it('should return false for missing amount', () => {
                expect(
                    validate({
                        ...validData,
                        items: [
                            {
                                description: 'Service',
                                qty: 10,
                                unitPrice: '100.00',
                                amount: ''
                            }
                        ]
                    })
                ).toBe(false);
            });

            it('should return false when item is not an object', () => {
                expect(
                    validate({ ...validData, items: ['not-an-object'] })
                ).toBe(false);
            });
        });
    });

    describe('invoice_classic', () => {
        const validate = templateValidators['invoice_classic']!;

        const classicData = {
            ...validData,
            companyLogo: 'https://example.com/logo.png'
        };

        describe('when companyLogo is a valid URL', () => {
            it('should return true', () => {
                expect(validate(classicData)).toBe(true);
            });
        });

        describe('when companyLogo is missing', () => {
            it('should return false', () => {
                const { companyLogo: _companyLogo, ...dataWithoutLogo } =
                    classicData;
                expect(validate(dataWithoutLogo)).toBe(false);
            });
        });

        describe('when companyLogo is not a valid URL', () => {
            it('should return false', () => {
                expect(
                    validate({ ...classicData, companyLogo: 'not-a-url' })
                ).toBe(false);
            });
        });
    });
});
