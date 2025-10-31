import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InteractiveMap from '../pages/InteractiveMap';

const MOCK_STATIONS = [
    { id: 1, city: 'Station High', is_available: 1, soil_saturation: 95.0, latitude: 18.1, longitude: -66.1 },
    { id: 2, city: 'Station Medium', is_available: 1, soil_saturation: 85.0, latitude: 18.2, longitude: -66.2 },
    { id: 3, city: 'Station Low', is_available: 1, soil_saturation: 75.0, latitude: 18.3, longitude: -66.3 },
    { id: 4, city: 'Station Unavailable', is_available: 0, soil_saturation: 90.0, latitude: 18.4, longitude: -66.4 },
    { id: 5, city: 'Station No Saturation', is_available: 1, soil_saturation: null, latitude: 18.5, longitude: -66.5 },
];

const MOCK_LANDSLIDES = [
    { landslide_id: 'LS-2024-A', landslide_date: '2024-01-15', latitude: 18.15, longitude: -66.15 },
    { landslide_id: 'LS-2024-B', landslide_date: '2024-03-20', latitude: 18.25, longitude: -66.25 },
    { landslide_id: 'LS-2023-A', landslide_date: '2023-07-10', latitude: 18.35, longitude: -66.35 },
    { landslide_id: 'LS-NULL', landslide_date: null, latitude: 18.45, longitude: -66.45 },
];

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        clear: vi.fn(() => { store = {}; }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue({ /* mock data */ })
}));

const mockFetch = (url) => {
    if (url.includes('stations')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(MOCK_STATIONS),
        });
    }
    if (url.includes('landslides')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(MOCK_LANDSLIDES),
        });
    }
    return Promise.reject(new Error(`Unhandled API call: ${url}`));
};

vi.mock('leaflet', () => ({
    default: {
        divIcon: vi.fn(options => ({ options })),
    },
}));

vi.mock('react-leaflet', async () => {
    const actual = await vi.importActual('react-leaflet');

    return {
        ...actual,
        MapContainer: vi.fn(({ children, ...props }) => <div data-testid="mock-map" {...props}>{children}</div>),
        TileLayer: vi.fn(() => <div data-testid="mock-tilelayer" />),
        ZoomControl: vi.fn(() => <div data-testid="mock-zoomcontrol" />),
        Marker: vi.fn(({ children, ...props }) => (
            <div data-testid="mock-marker" data-key={props.key}>
                {children}
            </div>
        )),
        Popup: vi.fn(({ children }) => <div data-testid="mock-popup">{children}</div>),
        useMap: vi.fn(() => ({
            removeLayer: vi.fn(),
            addLayer: vi.fn(),
        })),
    };
});

const mockEsriLayer = {
    addTo: vi.fn(() => mockEsriLayer), // Chainable
    removeLayer: vi.fn(),
};
vi.mock('esri-leaflet', () => ({
    tiledMapLayer: vi.fn(() => mockEsriLayer),
    featureLayer: vi.fn(() => mockEsriLayer),
    imageMapLayer: vi.fn(() => mockEsriLayer),
}));

beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('fetch', vi.fn(mockFetch));
    vi.spyOn(console, 'error').mockImplementation(() => {});
});


afterEach(() => {
    vi.clearAllMocks();
    console.error.mockRestore();
});

describe('InteractiveMap Component', () => {

    describe('Disclaimer Logic', () => {
        it('shows disclaimer by default and hides on agree', async () => {
            render(<InteractiveMap />);

            expect(screen.getByRole('heading', { name: /Aviso | Disclaimer/i })).toBeInTheDocument();
            expect(localStorage.getItem).toHaveBeenCalledWith('disclaimerAccepted');

            const agreeButton = screen.getByRole('button', { name: /Acepto | Agree/i });
            fireEvent.click(agreeButton);

            expect(localStorage.setItem).toHaveBeenCalledWith('disclaimerAccepted', 'true');

            await waitFor(() => {
                expect(screen.queryByRole('heading', { name: /Aviso | Disclaimer/i })).not.toBeInTheDocument();
            });
        });

        it('does not show disclaimer if already accepted', () => {
            localStorage.setItem('disclaimerAccepted', 'true');
            render(<InteractiveMap />);

            expect(screen.queryByRole('heading', { name: /Aviso | Disclaimer/i })).not.toBeInTheDocument();
        });
    });

    describe('Map Content Rendering', () => {
        beforeEach(() => {
            localStorage.setItem('disclaimerAccepted', 'true');
            render(<InteractiveMap />);
        });

        it('renders static map elements (legend, logo, labels)', () => {
            expect(screen.getByTestId('mock-map')).toBeInTheDocument();
            expect(screen.getByTestId('mock-tilelayer')).toBeInTheDocument();
            expect(screen.getByText('SOIL SATURATION PERCENTAGE')).toBeInTheDocument();
            expect(screen.getByAltText('Landslide Hazard Mitigation Logo')).toBeInTheDocument();

            expect(screen.getByText('0-80%')).toBeInTheDocument();
            expect(screen.getByText('80-90%')).toBeInTheDocument();
            expect(screen.getByText('90-100%')).toBeInTheDocument();
        });

        it('fetches and renders stations, filtering correctly', async () => {
            expect(await screen.findByText('Station High')).toBeInTheDocument();

            expect(screen.getByText('Station Medium')).toBeInTheDocument();
            expect(screen.getByText('Station Low')).toBeInTheDocument();

            expect(screen.queryByText('Station Unavailable')).not.toBeInTheDocument();
            expect(screen.queryByText('Station No Saturation')).not.toBeInTheDocument();

        });

        it('fetches and renders landslides and the year filter', async () => {
            expect(await screen.findByLabelText(/Filter Landslides by Year/i)).toBeInTheDocument();

            expect(screen.getByRole('option', { name: 'All Years' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: '2024' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: '2023' })).toBeInTheDocument();

            expect(screen.getByText('LS-2024-A')).toBeInTheDocument();
            expect(screen.getByText('LS-2024-B')).toBeInTheDocument();
            expect(screen.getByText('LS-2023-A')).toBeInTheDocument();
            expect(screen.getByText('LS-NULL')).toBeInTheDocument();
        });
    });

    describe('Landslide Filtering Logic', () => {
        it('filters landslides when a year is selected', async () => {
            localStorage.setItem('disclaimerAccepted', 'true');
            render(<InteractiveMap />);

            const select = await screen.findByLabelText(/Filter Landslides by Year/i);
            expect(await screen.findByText('LS-2024-A')).toBeInTheDocument();
            expect(screen.getByText('LS-2023-A')).toBeInTheDocument();
            expect(screen.getByText('LS-NULL')).toBeInTheDocument();

            fireEvent.change(select, { target: { value: '2024' } });

            expect(screen.getByText('LS-2024-A')).toBeInTheDocument();
            expect(screen.getByText('LS-2024-B')).toBeInTheDocument();
            expect(screen.queryByText('LS-2023-A')).not.toBeInTheDocument();
            expect(screen.queryByText('LS-NULL')).not.toBeInTheDocument();

            fireEvent.change(select, { target: { value: '2023' } });

            expect(screen.queryByText('LS-2024-A')).not.toBeInTheDocument();
            expect(screen.queryByText('LS-2024-B')).not.toBeInTheDocument();
            expect(screen.getByText('LS-2023-A')).toBeInTheDocument();
            expect(screen.queryByText('LS-NULL')).not.toBeInTheDocument();

            fireEvent.change(select, { target: { value: 'all' } });

            expect(screen.getByText('LS-2024-A')).toBeInTheDocument();
            expect(screen.getByText('LS-2024-B')).toBeInTheDocument();
            expect(screen.getByText('LS-2023-A')).toBeInTheDocument();
            expect(screen.getByText('LS-NULL')).toBeInTheDocument();
        });
    });
});