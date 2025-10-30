import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandslideReadyPR from './LandslideReadyPR';

describe('LandslideReadyPR Component', () => {

    beforeEach(() => {
        render(<LandslideReadyPR />);
    });

    it('renders the main header section correctly', () => {
        expect(screen.getByRole('heading', { name: /LandslideReady en Puerto Rico/i })).toBeInTheDocument();

        expect(screen.getByAltText('LandslideReady logo')).toBeInTheDocument();

        expect(screen.getByText(/promueve la preparación y resiliencia/i)).toBeInTheDocument();
    });

    it('renders the "Municipios" section with all images', () => {
        expect(screen.getByRole('heading', { name: /LandslideReady para Municipios/i })).toBeInTheDocument();

        expect(screen.getByText(/Actualizado en Marzo 4, 2025/i)).toBeInTheDocument();

        expect(screen.getByAltText('Mapa de municipios LandslideReady')).toBeInTheDocument();
        expect(screen.getByAltText('Ciclo LandslideReady')).toBeInTheDocument();
        expect(screen.getByAltText('Talleres comunitarios')).toBeInTheDocument();
    });

    it('renders the "Individuos" section with logo and text', () => {
        expect(screen.getByRole('heading', { name: /LandslideReady para Individuos/i })).toBeInTheDocument();

        expect(screen.getByText(/módulos gratuitos con los cuales podrán aprender/i)).toBeInTheDocument();

        expect(screen.getByAltText('Ecoexploratorio Logo')).toBeInTheDocument();
    });

    it('renders all external links correctly', () => {
        const ecoLogo = screen.getByAltText('Ecoexploratorio Logo');
        const ecoLink = ecoLogo.closest('a');

        expect(ecoLink).toBeInTheDocument();
        expect(ecoLink).toHaveAttribute('href', 'https://ecoexploratorio.org/eri/cursos/');
        expect(ecoLink).toHaveAttribute('target', '_blank');
        expect(ecoLink).toHaveAttribute('rel', 'noopener noreferrer');

        const cursoLink = screen.getByRole('link', { name: /Accede los Cursos/i });

        expect(cursoLink).toBeInTheDocument();
        expect(cursoLink).toHaveAttribute('href', 'https://ecoexploratorio.org/eri/cursos/#1742922273665-a07cced4-5bd4');
        expect(cursoLink).toHaveAttribute('target', '_blank');
    });

    it('renders the course preview section', () => {
        expect(screen.getByText(/Una vez que accedas a los módulos/i)).toBeInTheDocument();

        expect(screen.getByAltText('Vista previa del curso LandslideReady')).toBeInTheDocument();
    });

});