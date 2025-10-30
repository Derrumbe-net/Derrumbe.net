import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandslidePopup from './LandslidePopup';

vi.mock('react-leaflet', () => ({
    Popup: ({ children }) => <div data-testid="mock-popup">{children}</div>,
}));

describe('LandslidePopup Component', () => {

    it('renders null (nothing) if no landslide data is provided', () => {
        const { container } = render(<LandslidePopup landslide={null} />);

        expect(container.firstChild).toBeNull();

        expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();
    });

    it('renders null (nothing) if the landslide prop is undefined', () => {
        const { container } = render(<LandslidePopup />);

        expect(container.firstChild).toBeNull();
        expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();
    });

    it('renders all landslide details when data is provided', () => {
        const mockLandslide = {
            landslide_id: 'LS-TEST-001',
            landslide_date: '2025-10-29',
            latitude: 18.12345,
            longitude: -67.54321,
        };

        render(<LandslidePopup landslide={mockLandslide} />);

        expect(screen.getByTestId('mock-popup')).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /Reported Landslide Event/i })).toBeInTheDocument();

        expect(screen.getByText('ID:')).toBeInTheDocument();
        expect(screen.getByText(mockLandslide.landslide_id)).toBeInTheDocument();

        expect(screen.getByText('Reported Date:')).toBeInTheDocument();
        expect(screen.getByText(mockLandslide.landslide_date)).toBeInTheDocument();

        expect(screen.getByText('Latitude:')).toBeInTheDocument();
        expect(screen.getByText(mockLandslide.latitude.toString())).toBeInTheDocument();

        expect(screen.getByText('Longitude:')).toBeInTheDocument();
        expect(screen.getByText(mockLandslide.longitude.toString())).toBeInTheDocument();
    });
});