import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stations from '../pages/Stations';

describe('Stations Component', () => {

    beforeEach(() => {
        render(<Stations />);
    });

    it('renders the main heading', () => {
        const heading = screen.getByRole('heading', { name: /Estaciones/i });
        expect(heading).toBeInTheDocument();
    });

    it('renders the placeholder text', () => {
        const paragraph = screen.getByText('Aquí se demostrará información de las estaciones.');
        expect(paragraph).toBeInTheDocument();
        expect(paragraph.tagName).toBe('P');
    });

});