import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Report from '../pages/Report';

const viewEvents = {};

vi.mock("@arcgis/core/Map", () => ({ default: vi.fn() }));
vi.mock("@arcgis/core/views/MapView", () => ({
    default: vi.fn(() => ({
        on: vi.fn((event, callback) => { viewEvents[event] = callback; }),
        destroy: vi.fn(),
        goTo: vi.fn(() => Promise.resolve()),
        ui: { add: vi.fn() },
        graphics: { add: vi.fn(), remove: vi.fn() },
    })),
}));
vi.mock("@arcgis/core/widgets/Locate", () => ({ default: vi.fn() }));
vi.mock("@arcgis/core/Graphic", () => ({ default: vi.fn((args) => ({ ...args })) }));
vi.mock("@arcgis/core/geometry/Point", () => ({ default: vi.fn((args) => ({ ...args })) }));
vi.mock("@arcgis/core/widgets/CoordinateConversion", () => ({ default: vi.fn() }));
vi.mock("@arcgis/core/assets/esri/themes/light/main.css", () => ({ default: '' }));


const mockGeolocation = {
    getCurrentPosition: vi.fn((successCallback) => {
        successCallback({
            coords: { latitude: 18.22, longitude: -67.14 },
        });
    }),
};
Object.defineProperty(window.navigator, 'geolocation', {
    value: mockGeolocation,
    configurable: true,
});

Object.defineProperty(window.navigator, 'permissions', {
    value: { revoke: vi.fn(() => Promise.resolve()) },
    configurable: true,
});

const mockFile = new File(['(⌐□_□)'], 'derrumbe.png', { type: 'image/png' });

const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Locate from "@arcgis/core/widgets/Locate";
import Graphic from "@arcgis/core/Graphic";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import {act} from "react";

beforeEach(() => {
    render(<Report />);
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('Report Component', () => {

    it('renders all static content and form fields correctly', () => {
        expect(screen.getByRole('heading', { name: /Reporte de Deslizamiento/i })).toBeInTheDocument();
        expect(screen.getByText(/¿Viste un deslizamiento?/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Fecha/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descripción Breve/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Pueblo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Carretera/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Doy permiso a acceder mi localización/i)).toBeInTheDocument();

        expect(screen.queryByTestId('arcgis-map')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Enviar Reporte/i })).toBeEnabled();
    });

    it('handles basic form input changes', () => {
        const nameInput = screen.getByLabelText(/Nombre Completo/i);
        const dateInput = screen.getByLabelText(/Fecha/i);
        const puebloSelect = screen.getByLabelText(/Pueblo/i);

        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        fireEvent.change(dateInput, { target: { value: '2025-10-29' } });
        fireEvent.change(puebloSelect, { target: { value: 'Mayagüez' } });

        expect(nameInput.value).toBe('Test User');
        expect(dateInput.value).toBe('2025-10-29');
        expect(puebloSelect.value).toBe('Mayagüez');
    });

    it('handles file upload via "Select Files" and file removal', async () => {
        const fileInput = screen.getByLabelText(/or Select Files to Upload/i);

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(await screen.findByText(mockFile.name)).toBeInTheDocument();

        const removeButton = screen.getByRole('button', { name: '×' });
        fireEvent.click(removeButton);

        expect(screen.queryByText(mockFile.name)).not.toBeInTheDocument();
    });

    it('shows the map and triggers geolocation when checkbox is clicked', async () => {
        const locationCheckbox = screen.getByLabelText(/Doy permiso/i);

        expect(MapView).not.toHaveBeenCalled();
        expect(mockGeolocation.getCurrentPosition).not.toHaveBeenCalled();

        fireEvent.click(locationCheckbox);

        await waitFor(() => {
            expect(EsriMap).toHaveBeenCalled();
            expect(MapView).toHaveBeenCalled();
            expect(Locate).toHaveBeenCalled();
            expect(CoordinateConversion).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();

            const mapViewInstance = MapView.mock.results[0].value;
            expect(mapViewInstance.goTo).toHaveBeenCalledWith({ center: [-67.14, 18.22], zoom: 17 });
            expect(Graphic).toHaveBeenCalled();
        });
    });

    it('submits the full form payload, including map coordinates from a manual click', async () => {
        fireEvent.change(screen.getByLabelText(/Fecha/i), { target: { value: '2025-10-29' } });
        fireEvent.change(screen.getByLabelText(/Pueblo/i), { target: { value: 'Adjuntas' } });

        fireEvent.click(screen.getByLabelText(/Doy permiso/i));
        await waitFor(() => {
            expect(MapView).toHaveBeenCalled();
        });

        const manualCoords = { latitude: 18.16, longitude: -66.72 };
        expect(viewEvents.click).toBeInstanceOf(Function);
        viewEvents.click({ mapPoint: manualCoords });

        const fileInput = screen.getByLabelText(/or Select Files to Upload/i);
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
        expect(await screen.findByText(mockFile.name)).toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: /Enviar/i });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Enviar/i })).toBeEnabled()
        });

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith("¡Reporte preparado! (Actualmente en modo demo)");
        });

        expect(consoleLogSpy).toHaveBeenCalledWith(
            "Report payload (preview):",
            expect.objectContaining({
                date: "2025-10-29",
                pueblo: "Adjuntas",
                allowLocation: true,
                coordinates: { lat: manualCoords.latitude, lng: manualCoords.longitude },
                files: expect.arrayContaining([
                    expect.objectContaining({ name: mockFile.name, size: mockFile.size })
                ])
            })
        );

        expect(alertSpy).toHaveBeenCalledWith("¡Reporte preparado! (Actualmente en modo demo)");

        expect(screen.getByRole('button', { name: /Enviar Reporte/i })).toBeEnabled();
    });

});