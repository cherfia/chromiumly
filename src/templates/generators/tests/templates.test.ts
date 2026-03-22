import { Chromiumly } from '../../../main.config';
import { Templates } from '../templates';

const mockResponse = () => new Response('content');

const getResponseBuffer = async () => {
    const responseBuffer = await mockResponse().arrayBuffer();
    return Buffer.from(responseBuffer);
};

const mockFetch = jest
    .spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve(mockResponse()));

type ChromiumlyWithPrivate = {
    gotenbergApiKey: string | undefined;
};

const validRequest = {
    type: 'invoice_saas' as const,
    data: {
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
        currency: 'USD' as const,
        subTotal: '1000.00',
        taxRate: 10,
        taxAmount: '100.00',
        total: '1100.00',
        footerNote: 'Thank you for your business.',
        footerDisclaimer: 'All prices in USD.'
    }
};

describe('Templates', () => {
    const generator = new Templates();

    describe('endpoint', () => {
        it('should route to the templates convert route', () => {
            expect(generator.endpoint).toEqual(
                'http://localhost:3000/templates/generate'
            );
        });
    });

    describe('generate', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            Chromiumly.configure({ apiKey: 'test-api-key' });
            mockFetch.mockImplementation(() => Promise.resolve(mockResponse()));
        });

        afterEach(() => {
            jest.resetAllMocks();
            (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergApiKey =
                undefined;
        });

        describe('when API key is not configured', () => {
            it('should throw an error', async () => {
                (
                    Chromiumly as unknown as ChromiumlyWithPrivate
                ).gotenbergApiKey = undefined;
                await expect(() =>
                    generator.generate(validRequest)
                ).rejects.toThrow(
                    'Templates requires an API key. Please configure it via Chromiumly.configure({ apiKey: "..." }).'
                );
            });
        });

        describe('when request is valid', () => {
            it('should return a buffer', async () => {
                const buffer = await generator.generate(validRequest);
                expect(buffer).toEqual(await getResponseBuffer());
                expect(mockFetch).toHaveBeenCalledWith(
                    'http://localhost:3000/templates/generate',
                    expect.objectContaining({
                        method: 'POST',
                        headers: {
                            'X-Api-Key': 'test-api-key',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(validRequest)
                    })
                );
            });
        });

        describe('when validate option is true and data is valid', () => {
            it('should return a buffer', async () => {
                const buffer = await generator.generate(validRequest, {
                    validate: true
                });
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when validate option is true and data is invalid', () => {
            it('should throw an error', async () => {
                const invalidRequest = {
                    ...validRequest,
                    data: { ...validRequest.data, invoiceNumber: '' }
                };
                await expect(() =>
                    generator.generate(invalidRequest, { validate: true })
                ).rejects.toThrow(
                    'Invalid template data for type "invoice_saas"'
                );
            });
        });

        describe('when validate option is true and no validator exists for the type', () => {
            it('should return a buffer', async () => {
                const buffer = await generator.generate(
                    {
                        type: 'invoice_freelancer' as const,
                        data: validRequest.data
                    },
                    { validate: true }
                );
                expect(buffer).toEqual(await getResponseBuffer());
            });
        });

        describe('when fetch request fails', () => {
            it('should throw an error', async () => {
                const errorMessage =
                    'FetchError: request to http://localhost:3000/templates/generate failed';
                mockFetch.mockRejectedValue(new Error(errorMessage));
                await expect(() =>
                    generator.generate(validRequest)
                ).rejects.toThrow(errorMessage);
            });
        });

        describe('when response is not ok', () => {
            it('should throw a Gotenberg API Error with trace', async () => {
                mockFetch.mockResolvedValue(
                    new Response('Bad Request', {
                        status: 400,
                        statusText: 'Bad Request',
                        headers: { 'gotenberg-trace': 'test-trace' }
                    })
                );
                await expect(() =>
                    generator.generate(validRequest)
                ).rejects.toThrow('Trace: test-trace');
            });

            it('should throw a Gotenberg API Error with "No trace" when trace header is absent', async () => {
                mockFetch.mockResolvedValue(
                    new Response('Bad Request', {
                        status: 400,
                        statusText: 'Bad Request'
                    })
                );
                await expect(() =>
                    generator.generate(validRequest)
                ).rejects.toThrow('Trace: No trace');
            });
        });
    });
});
