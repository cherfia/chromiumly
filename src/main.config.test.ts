import { Chromiumly } from './main.config';

type ChromiumlyWithPrivate = {
    gotenbergEndpoint: string | undefined;
};

describe('Chromiumly', () => {
    const originalEndpoint = (Chromiumly as unknown as ChromiumlyWithPrivate)
        .gotenbergEndpoint;

    afterEach(() => {
        (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergEndpoint =
            originalEndpoint;
    });

    describe('getGotenbergEndpoint', () => {
        it('should return the endpoint when it is set', () => {
            Chromiumly.configure({ endpoint: 'http://localhost:3000' });
            expect(Chromiumly.getGotenbergEndpoint()).toBe(
                'http://localhost:3000'
            );
        });

        it('should throw an error when endpoint is not set', () => {
            (Chromiumly as unknown as ChromiumlyWithPrivate).gotenbergEndpoint =
                undefined;

            expect(() => {
                Chromiumly.getGotenbergEndpoint();
            }).toThrow(
                'Gotenberg endpoint is not set. Please ensure that the Gotenberg service endpoint is configured correctly in your environment variables or through the configure method.'
            );
        });
    });
});
