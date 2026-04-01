import { System } from './system';

const mockGetResponse = () => new Response('content');
const mockHeadResponse = () => new Response(null, { status: 200 });

const getResponseBuffer = async () => {
    const responseBuffer = await mockGetResponse().arrayBuffer();
    return Buffer.from(responseBuffer);
};

const mockFetch = jest.spyOn(global, 'fetch');

describe('System', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockImplementation(() => Promise.resolve(mockGetResponse()));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call GET /health', async () => {
        const buffer = await System.getHealth();
        expect(buffer).toEqual(await getResponseBuffer());
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:3000/health',
            expect.objectContaining({
                method: 'GET'
            })
        );
    });

    it('should call HEAD /health', async () => {
        mockFetch.mockImplementation(() => Promise.resolve(mockHeadResponse()));
        const buffer = await System.headHealth();
        expect(buffer).toEqual(Buffer.alloc(0));
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:3000/health',
            expect.objectContaining({
                method: 'HEAD'
            })
        );
    });

    it('should call GET /version', async () => {
        const buffer = await System.getVersion();
        expect(buffer).toEqual(await getResponseBuffer());
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:3000/version',
            expect.objectContaining({
                method: 'GET'
            })
        );
    });

    it('should call GET /debug', async () => {
        const buffer = await System.getDebug();
        expect(buffer).toEqual(await getResponseBuffer());
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:3000/debug',
            expect.objectContaining({
                method: 'GET'
            })
        );
    });

    it('should call GET /prometheus/metrics', async () => {
        const buffer = await System.getPrometheusMetrics();
        expect(buffer).toEqual(await getResponseBuffer());
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:3000/prometheus/metrics',
            expect.objectContaining({
                method: 'GET'
            })
        );
    });
});
