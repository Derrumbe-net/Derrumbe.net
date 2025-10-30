import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
    it('renders all main links', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Check basic links
        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();
        expect(screen.getByText('Reportar')).toBeInTheDocument();
        expect(screen.getByText('LandslideReady')).toBeInTheDocument();
    });

    it('toggles dropdown menus when clicked', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const contribBtn = screen.getByRole('button', { name: /Contribuciones/i });
        expect(screen.queryByText('Proyectos')).not.toBeInTheDocument();

        // Click to open
        fireEvent.click(contribBtn);
        expect(screen.getByText('Proyectos')).toBeInTheDocument();
        expect(screen.getByText('Publicaciones')).toBeInTheDocument();

        // Click again to close
        fireEvent.click(contribBtn);
        expect(screen.queryByText('Proyectos')).not.toBeInTheDocument();
    });

    it('renders dropdown background when a menu is open', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const monitoreoBtn = screen.getByRole('button', { name: /Monitoreo/i });
        fireEvent.click(monitoreoBtn);

        expect(document.querySelector('.nav__dropdown-background')).toBeInTheDocument();
    });
});
