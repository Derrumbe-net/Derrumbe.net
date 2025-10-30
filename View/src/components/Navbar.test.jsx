import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

const renderNavbar = () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );
};

describe('Navbar Component', () => {

    beforeEach(() => {
        renderNavbar();
    });

    it('renders all main navigation items', () => {
        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();
        expect(screen.getByText('Reportar')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Investigación/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Monitoreo/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Recursos/i })).toBeInTheDocument();

        expect(screen.getByAltText('LandslideReady PR')).toBeInTheDocument();
    });

    it('toggles "Investigación" dropdown on click', () => {
        const investigacionBtn = screen.getByRole('button', { name: /Investigación/i });

        expect(screen.queryByText('Proyectos')).not.toBeInTheDocument();
        expect(screen.queryByText('Publicaciones')).not.toBeInTheDocument();

        fireEvent.click(investigacionBtn);
        expect(screen.getByText('Proyectos')).toBeInTheDocument();
        expect(screen.getByText('Publicaciones')).toBeInTheDocument();

        fireEvent.click(investigacionBtn);
        expect(screen.queryByText('Proyectos')).not.toBeInTheDocument();
    });

    it('toggles "Monitoreo" dropdown on click', () => {
        const monitoreoBtn = screen.getByRole('button', { name: /Monitoreo/i });
        expect(screen.queryByText('Mapa Interactivo')).not.toBeInTheDocument();

        fireEvent.click(monitoreoBtn);
        expect(screen.getByText('Mapa Interactivo')).toBeInTheDocument();
        expect(screen.getByText('Estaciones')).toBeInTheDocument();
        expect(screen.getByText('Pronóstico de lluvia')).toBeInTheDocument();

        fireEvent.click(monitoreoBtn);
        expect(screen.queryByText('Mapa Interactivo')).not.toBeInTheDocument();
    });

    it('toggles "Recursos" dropdown on click', () => {
        const recursosBtn = screen.getByRole('button', { name: /Recursos/i });
        expect(screen.queryByText('Guía sobre Deslizamientos')).not.toBeInTheDocument();

        fireEvent.click(recursosBtn);
        expect(screen.getByText('Guía sobre Deslizamientos')).toBeInTheDocument();
        expect(screen.getByText('Mapa de Susceptibilidad')).toBeInTheDocument();

        fireEvent.click(recursosBtn);
        expect(screen.queryByText('Guía sobre Deslizamientos')).not.toBeInTheDocument();
    });

    it('toggles "LandslideReady" dropdown on click', () => {
        const landslideReadyBtn = screen.getByRole('button', { name: /LandslideReady PR/i });
        expect(screen.queryByText('LandslideReady para Individuos')).not.toBeInTheDocument();

        fireEvent.click(landslideReadyBtn);
        expect(screen.getByText('LandslideReady para Individuos')).toBeInTheDocument();
        expect(screen.getByText('LandslideReady para Municipios')).toBeInTheDocument();

        fireEvent.click(landslideReadyBtn);
        expect(screen.queryByText('LandslideReady para Individuos')).not.toBeInTheDocument();
    });

    it('closes one dropdown when another is opened', () => {
        const investigacionBtn = screen.getByRole('button', { name: /Investigación/i });
        const monitoreoBtn = screen.getByRole('button', { name: /Monitoreo/i });

        fireEvent.click(investigacionBtn);
        expect(screen.getByText('Proyectos')).toBeInTheDocument();
        expect(screen.queryByText('Mapa Interactivo')).not.toBeInTheDocument();

        fireEvent.click(monitoreoBtn);

        expect(screen.queryByText('Proyectos')).not.toBeInTheDocument();
        expect(screen.getByText('Mapa Interactivo')).toBeInTheDocument();
    });

    it('toggles mobile hamburger menu', () => {
        const hamburgerBtn = screen.getByRole('button', { name: /Toggle menu/i });
        const navList = screen.getByRole('list');

        expect(navList).not.toHaveClass('active');

        fireEvent.click(hamburgerBtn);
        expect(navList).toHaveClass('active');

        fireEvent.click(hamburgerBtn);
        expect(navList).not.toHaveClass('active');
    });
});