import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Publications from '../pages/Publications';

describe('Publications Component', () => {

    const PUB_GUANICA_TITLE = /Tracking a limestone bedrock landslide on an urbanized hillslope in Guanica, Puerto Rico/i;
    const PUB_CHEMICAL_TITLE = /Chemical Weathering and Physical Erosion Fluxes From Serpentinite in Puerto Rico/i;
    const PUB_NEOTECTONIC_TITLE = /Neotectonic Mapping of Puerto Rico/i;

    const ALL_PUBS_COUNT = 19;

    beforeEach(() => {
        render(<Publications />);
    });

    it('renders static content and all publications by default', () => {
        expect(screen.getByRole('heading', { name: /Publicaciones/i })).toBeInTheDocument();
        expect(screen.getByText(/Explore nuestra colección de publicaciones/i)).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

        const allPubButtons = screen.getAllByRole('link', { name: /Leer más →/i });
        expect(allPubButtons.length).toBe(ALL_PUBS_COUNT);

        expect(screen.getByRole('heading', { name: PUB_GUANICA_TITLE })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PUB_CHEMICAL_TITLE })).toBeInTheDocument();
    });

    it('filters publications based on search term, case-insensitively', () => {
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(searchInput, { target: { value: 'gUaNiCa' } });

        expect(screen.getByRole('heading', { name: PUB_GUANICA_TITLE })).toBeInTheDocument();

        expect(screen.queryByRole('heading', { name: PUB_CHEMICAL_TITLE })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: PUB_NEOTECTONIC_TITLE })).not.toBeInTheDocument();

        const allPubButtons = screen.getAllByRole('link', { name: /Leer más →/i });
        expect(allPubButtons.length).toBe(1);
    });

    it('shows no publications when search term matches nothing', () => {
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(searchInput, { target: { value: 'zzxxyy123' } });

        expect(screen.queryByRole('heading', { name: PUB_GUANICA_TITLE })).not.toBeInTheDocument();

        expect(screen.queryByRole('link', { name: /Leer más →/i })).toBeNull();
    });

    it('resets the list when the search term is cleared', () => {
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(searchInput, { target: { value: 'Guanica' } });
        let allPubButtons = screen.getAllByRole('link', { name: /Leer más →/i });
        expect(allPubButtons.length).toBe(1);

        fireEvent.change(searchInput, { target: { value: '' } });

        allPubButtons = screen.getAllByRole('link', { name: /Leer más →/i });
        expect(allPubButtons.length).toBe(ALL_PUBS_COUNT);
        expect(screen.getByRole('heading', { name: PUB_GUANICA_TITLE })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PUB_CHEMICAL_TITLE })).toBeInTheDocument();
    });

    it('renders all content correctly within a publication card', () => {
        const titleElement = screen.getByRole('heading', { name: PUB_CHEMICAL_TITLE });

        const card = titleElement.closest('.publication-card');

        expect(within(card).getByAltText(PUB_CHEMICAL_TITLE)).toBeInTheDocument();

        expect(within(card).getByText(/Angus K. Moore/i)).toBeInTheDocument();

        const link = within(card).getByRole('link', { name: /Leer más →/i });
        expect(link).toHaveAttribute('href', 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024JF007776');
        expect(link).toHaveAttribute('target', '_blank');
    });

});