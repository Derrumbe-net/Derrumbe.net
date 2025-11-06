import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SusceptibilityMap from '../pages/SusceptibilityMap';

describe('SusceptibilityMap Component', () => {

    beforeEach(() => {
        render(<SusceptibilityMap />);
    });

    it('renders the main heading', () => {
        const heading = screen.getByRole('heading', {
            name: /Mapa de Susceptibilidad a Dezlizamientos/i
        });
        expect(heading).toBeInTheDocument();
    });

    it('renders the placeholder text with typos', () => {
        const paragraph = screen.getByText(
            /Aquí se demostrará el mapa interctivo de ARcGis al igual que losn mapas/i
        );

        expect(paragraph).toBeInTheDocument();
        expect(paragraph.tagName).toBe('P');
    });

});