import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import Publications from '../pages/Publications';

const MOCK_PUBLICATIONS_FROM_API = [
    { publication_id: 'pub1', title: 'Tracking a limestone bedrock landslide on an urbanized hillslope in Guanica, Puerto Rico', description: 'Author A', publication_url: '#', image: '...' },
    { publication_id: 'pub2', title: 'Chemical Weathering and Physical Erosion Fluxes From Serpentinite in Puerto Rico', description: 'Angus K. Moore', publication_url: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024JF007776', image: '...' },
    { publication_id: 'pub3', title: 'Neotectonic Mapping of Puerto Rico', description: 'Author C', publication_url: '#', image: '...' },
];

const mockFetch = async (url) => {
    if (url === 'https://derrumbe-test.derrumbe.net/api/publications') {
        return { ok: true, json: () => Promise.resolve(MOCK_PUBLICATIONS_FROM_API) };
    }
    return Promise.reject(new Error(`Unhandled API call: ${url}`));
};


describe('Publications Component', () => {

    const PUB_GUANICA_TITLE = /Tracking a limestone bedrock landslide on an urbanized hillslope in Guanica, Puerto Rico/i;
    const PUB_CHEMICAL_TITLE = /Chemical Weathering and Physical Erosion Fluxes From Serpentinite in Puerto Rico/i;
    const PUB_NEOTECTONIC_TITLE = /Neotectonic Mapping of Puerto Rico/i;

    const MOCKED_PUBS_COUNT = MOCK_PUBLICATIONS_FROM_API.length;

    let consoleErrorSpy;

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn(mockFetch));
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<Publications />);
    });

    afterEach(() => {
        vi.clearAllMocks();
        consoleErrorSpy.mockRestore();
    });

    it('renders static content and all publications by default', async () => {
        expect(screen.getByRole('heading', { name: /Publicaciones/i })).toBeInTheDocument();
        expect(screen.getByText(/Explore nuestra colección de publicaciones/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

        const allPubButtons = await screen.findAllByRole('link', { name: /Leer más →/i });
        expect(allPubButtons.length).toBe(MOCKED_PUBS_COUNT);

        expect(await screen.findByRole('heading', { name: PUB_GUANICA_TITLE })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PUB_CHEMICAL_TITLE })).toBeInTheDocument();
    });

    it('filters publications based on search term, case-insensitively', async () => {
        await screen.findAllByRole('link', { name: /Leer más →/i });

        const searchInput = screen.getByPlaceholderText('Search');
        fireEvent.change(searchInput, { target: { value: 'gUaNiCa' } });

        expect(await screen.findByRole('heading', { name: PUB_GUANICA_TITLE })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: PUB_CHEMICAL_TITLE })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: PUB_NEOTECTONIC_TITLE })).not.toBeInTheDocument();

        const allPubButtons = await screen.findAllByRole('link', { name: /Leer más →/i });
        expect(allPubButtons.length).toBe(1);
    });

    it('shows no publications when search term matches nothing', async () => {
        await screen.findAllByRole('link', { name: /Leer más →/i });
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(searchInput, { target: { value: 'zzxxyy123' } });

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: PUB_GUANICA_TITLE })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /Leer más →/i })).toBeNull();
        });
    });

    it('resets the list when the search term is cleared', async () => {
        await screen.findAllByRole('link', { name: /Leer más →/i });
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(searchInput, { target: { value: 'Guanica' } });
        let allPubButtons = await screen.findAllByRole('link', { name: /Leer más →/i });
        expect(allPubButtons.length).toBe(1);

        fireEvent.change(searchInput, { target: { value: '' } });

        allPubButtons = await screen.findAllByRole('link', { name: /Leer más →/i });
        expect(allPubButtons.length).toBe(MOCKED_PUBS_COUNT);
        expect(screen.getByRole('heading', { name: PUB_GUANICA_TITLE })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PUB_CHEMICAL_TITLE })).toBeInTheDocument();
    });

    it('renders all content correctly within a publication card', async () => {
        const titleElement = await screen.findByRole('heading', { name: PUB_CHEMICAL_TITLE });

        const card = titleElement.closest('.publication-card');

        expect(within(card).getByAltText(PUB_CHEMICAL_TITLE)).toBeInTheDocument();
        expect(within(card).getByText(/Angus K. Moore/i)).toBeInTheDocument();

        const link = within(card).getByRole('link', { name: /Leer más →/i });
        expect(link).toHaveAttribute('href', 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024JF007776');
        expect(link).toHaveAttribute('target', '_blank');
    });

});