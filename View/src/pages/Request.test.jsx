import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EducationalTalkRequest from "./Request";

const windowOpenSpy = vi.spyOn(window, 'open');

beforeEach(() => {
    windowOpenSpy.mockImplementation(() => {});

    render(<EducationalTalkRequest />);
});

afterEach(() => {
    windowOpenSpy.mockClear();
});

describe('EducationalTalkRequest Component', () => {

    it('renders all static content, headings, and lists', () => {
        expect(screen.getByRole('heading', { name: /Solicitud de Charla/i })).toBeInTheDocument();

        expect(screen.getByAltText('Charla educativa en escuela')).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /Reglamento para Conferencias/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Conferencias Virtuales/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Visitas a Escuelas/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Conferencias para Público en General/i })).toBeInTheDocument();

        expect(screen.getByText(/El solicitante de la conferencia debe contar con internet/i)).toBeInTheDocument();
        expect(screen.getByText(/Proveer estacionamiento seguro para el recurso/i)).toBeInTheDocument();
        expect(screen.getByText(/Contar con un mínimo de 10 personas/i)).toBeInTheDocument();
    });

    it('starts with the checkbox unchecked', () => {
        const checkbox = screen.getByLabelText(/He leído las reglas y las acepto/i);

        expect(checkbox).not.toBeChecked();
    });

    it('opens the Microsoft Forms link in a new tab when checkbox is checked', () => {
        const checkbox = screen.getByLabelText(/He leído las reglas y las acepto/i);
        const expectedUrl = "https://forms.office.com/pages/responsepage.aspx?id=wF36DW8DFUaZ5JSvgi8rhIlImwsjD_VBt9FEUbX9hshUNVI0NjVRSDlVMzZUTUYwTzJMVVRSWFJJMyQlQCN0PWcu&route=shorturl";

        expect(windowOpenSpy).not.toHaveBeenCalled();

        fireEvent.click(checkbox);

        expect(checkbox).toBeChecked();

        expect(windowOpenSpy).toHaveBeenCalledTimes(1);
        expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, "_blank");
    });

    it('does not call window.open again when the checkbox is unchecked', () => {
        const checkbox = screen.getByLabelText(/He leído las reglas y las acepto/i);

        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        expect(windowOpenSpy).toHaveBeenCalledTimes(1);

        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();

        expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    });
});