import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Projects from '../pages/Projects';

const MOCK_PROJECTS_FROM_API = [
    { project_id: 'p1', title: 'LandslideReady community engagement', project_status: 'active', start_year: 2023, end_year: 2024, description: 'Description for LandslideReady...', image: '...' },
    { project_id: 'p2', title: 'Climate Adaptation Partnerships', project_status: 'active', start_year: 2023, end_year: 2024, description: 'Description for Climate Adaptation...', image: '...' },
    { project_id: 'p3', title: 'Evaluation of the Soil Mass Movement (SLIDES-PR)', project_status: 'inactive', start_year: 2022, end_year: 2023, description: 'Description for SLIDES-PR...', image: '...' },
    { project_id: 'p4', title: 'Geologic characteristics of volcanic arc rocks', project_status: 'inactive', start_year: 2022, end_year: 2023, description: 'Description for Geologic characteristics...', image: '...' },
];

const mockFetch = async (url) => {
    if (url === 'https://derrumbe-test.derrumbe.net/api/projects') {
        return { ok: true, json: () => Promise.resolve(MOCK_PROJECTS_FROM_API) };
    }
    return Promise.reject(new Error(`Unhandled API call: ${url}`));
};

describe('Projects Component', () => {

    const PROYECTO_PRESENTE_1 = /LandslideReady community engagement/i;
    const PROYECTO_PRESENTE_2 = /Climate Adaptation Partnerships/i;
    const PROYECTO_PASADO_1 = /Evaluation of the Soil Mass Movement/i;
    const PROYECTO_PASADO_2 = /volcanic arc rocks/i;

    let consoleErrorSpy;

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn(mockFetch));
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<Projects />);
    });

    afterEach(() => {
        vi.clearAllMocks();
        consoleErrorSpy.mockRestore();
    });

    it('renders static content and default "all" projects', async () => {
        expect(screen.getByRole('heading', { name: /Proyectos/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Todos los Proyectos' }).selected).toBe(true);

        expect(await screen.findByRole('heading', { name: PROYECTO_PRESENTE_1 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PROYECTO_PRESENTE_2 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PROYECTO_PASADO_1 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PROYECTO_PASADO_2 })).toBeInTheDocument();
    });

    it('toggles between "present" and "past" projects on dropdown change', async () => {
        await screen.findByRole('heading', { name: PROYECTO_PRESENTE_1 });
        const filterSelect = screen.getByRole('combobox');

        fireEvent.change(filterSelect, { target: { value: 'past' } });

        expect(await screen.findByRole('heading', { name: PROYECTO_PASADO_1 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PROYECTO_PASADO_2 })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_1 })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_2 })).not.toBeInTheDocument();

        fireEvent.change(filterSelect, { target: { value: 'present' } });

        expect(await screen.findByRole('heading', { name: PROYECTO_PRESENTE_1 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: PROYECTO_PRESENTE_2 })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_1 })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_2 })).not.toBeInTheDocument();
    });

    it('filters "present" projects based on search term', async () => {
        const searchInput = screen.getByPlaceholderText('Search');
        const filterSelect = screen.getByRole('combobox');

        fireEvent.change(filterSelect, { target: { value: 'present' } });
        await screen.findByRole('heading', { name: PROYECTO_PRESENTE_1 });

        fireEvent.change(searchInput, { target: { value: 'LandslideReady community' } });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: PROYECTO_PRESENTE_1 })).toBeInTheDocument();
        });
        expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_2 })).not.toBeInTheDocument();
    });

    it('filters "past" projects based on search term', async () => {
        const filterSelect = screen.getByRole('combobox');
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(filterSelect, { target: { value: 'past' } });
        await screen.findByRole('heading', { name: PROYECTO_PASADO_1 });

        fireEvent.change(searchInput, { target: { value: 'SLIDES-PR' } });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: PROYECTO_PASADO_1 })).toBeInTheDocument();
        });
        expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_2 })).not.toBeInTheDocument();
    });

    it('shows no projects when search term matches nothing', async () => {
        await screen.findByRole('heading', { name: PROYECTO_PRESENTE_1 });
        const searchInput = screen.getByPlaceholderText('Search');

        fireEvent.change(searchInput, { target: { value: 'zzxxyy123' } });

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_1 })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: PROYECTO_PRESENTE_2 })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_1 })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: PROYECTO_PASADO_2 })).not.toBeInTheDocument();
        });
    });
});