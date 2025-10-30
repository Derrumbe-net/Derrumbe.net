import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StationPopup from './StationPopup';

vi.mock('react-leaflet', () => ({
    Popup: ({ children }) => <div data-testid="mock-popup">{children}</div>,
}));

describe('StationPopup Component', () => {

    it('renders null (nothing) if no station prop is provided', () => {
        const { container } = render(<StationPopup station={null} />);

        expect(container.firstChild).toBeNull();

        expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();
    });

    it('renders null (nothing) if the station prop is undefined', () => {
        const { container } = render(<StationPopup />);

        expect(container.firstChild).toBeNull();
        expect(screen.queryByTestId('mock-popup')).not.toBeInTheDocument();
    });

    it('renders all station details when data is provided', () => {
        const mockStation = {
            city: 'Mayagüez',
            last_updated: '2025-10-29 10:30:00',
            soil_saturation: 85.2,
            precipitation: 1.2
        };

        render(<StationPopup station={mockStation} />);

        expect(screen.getByTestId('mock-popup')).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /Mayagüez/i })).toBeInTheDocument();

        expect(screen.getByText('Last Updated:')).toBeInTheDocument();
        expect(screen.getByText(`${mockStation.last_updated} AST`)).toBeInTheDocument();

        expect(screen.getByText('Soil Saturation:')).toBeInTheDocument();
        expect(screen.getByText(`${mockStation.soil_saturation}%`)).toBeInTheDocument();

        expect(screen.getByText('12 HRS Precipitation:')).toBeInTheDocument();
        expect(screen.getByText(`${mockStation.precipitation} inches`)).toBeInTheDocument();
    });

    it('renders correctly when precipitation and saturation values are 0', () => {
        const mockStationZero = {
            city: 'San Juan',
            last_updated: '2025-10-29 11:00:00',
            soil_saturation: 0,
            precipitation: 0
        };

        render(<StationPopup station={mockStationZero} />);

        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('0 inches')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /San Juan/i })).toBeInTheDocument();
    });
});