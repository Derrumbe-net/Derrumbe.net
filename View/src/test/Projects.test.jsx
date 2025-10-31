import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Projects from '../pages/Projects';

describe('Projects Component', () => {

    const PROYECTO_PRESENTE_1 = /LandslideReady community engagement/i;
    const PROYECTO_PRESENTE_2 = /Climate Adaptation Partnerships/i;
    const PROYECTO_PASADO_1 = /Evaluation of the Soil Mass Movement/i;
    const PROYECTO_PASADO_2 = /volcanic arc rocks/i;

    beforeEach(() => {
        render(<Projects />);
    });

    it('renders static content and default "present" projects', () => {
        expect(screen.getByRole('heading', { name: /Proyectos/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Proyectos Actuales/i })).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: PROYECTO_PRESENTE_1 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PROYECTO_PRESENTE_2 })).toBeInTheDocument();

        expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_1 })).not.toBeInTheDocument();
    });

    it('toggles between "present" and "past" projects on button click', () => {
        const filterButton = screen.getByRole('button', { name: /Proyectos Actuales/i });

        fireEvent.click(filterButton);

        expect(screen.getByRole('button', { name: /Proyectos Pasados/i })).toBeInTheDocument();

        expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_1 })).not.toBeInTheDocument();

        expect(screen.getByRole('heading', { name: PROYECTO_PASADO_1 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PROYECTO_PASADO_2 })).toBeInTheDocument();

        fireEvent.click(filterButton);

        expect(screen.getByRole('button', { name: /Proyectos Actuales/i })).toBeInTheDocument();

        expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_1 })).not.toBeInTheDocument();

        expect(screen.getByRole('heading', { name: PROYECTO_PRESENTE_1 })).toBeInTheDocument();
    });

    it('filters "present" projects based on search term', () => {
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(searchInput, { target: { value: 'LandslideReady community' } });

        expect(screen.getByRole('heading', { name: PROYECTO_PRESENTE_1 })).toBeInTheDocument();

        expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_2 })).not.toBeInTheDocument();
    });

    it('filters "past" projects based on search term', () => {
        const filterButton = screen.getByRole('button', { name: /Proyectos Actuales/i });
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.click(filterButton);
        expect(screen.getByRole('button', { name: /Proyectos Pasados/i })).toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'SLIDES-PR' } });

        expect(screen.getByRole('heading', { name: PROYECTO_PASADO_1 })).toBeInTheDocument();

        expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_2 })).not.toBeInTheDocument();
    });

    it('shows no projects when search term matches nothing', () => {
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(searchInput, { target: { value: 'zzxxyy123' } });

        expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_1 })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_2 })).not.toBeInTheDocument();

        expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_1 })).not.toBeInTheDocument();
    });
});