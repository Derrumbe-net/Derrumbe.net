describe('Landslide Reporting Lifecycle: Submission to Public Map', () => {
    const API_URL = Cypress.env('VITE_API_URL') || 'http://localhost:8080/api';

    // ============================
    // TIMERS
    // ============================
    const timers = {
        start: 0,
        submissionStart: 0,
        submissionEnd: 0,
        adminStart: 0,
        adminEnd: 0,
        mapStart: 0,
        mapEnd: 0,
        end: 0
    };

    before(() => {
        timers.start = Date.now();
    });

    // Mock Data
    const MOCK_COORDS = { lat: 18.2208, lng: -66.5901 };
    const REPORT_DATA = {
        city: 'Utuado',
        date: new Date().toISOString().split('T')[0],
        description: 'E2E Test: Massive landslide blocking PR-123.',
        reporter_name: 'Cypress Tester'
    };

    const NEW_REPORT_ID = 101;
    const NEW_LANDSLIDE_ID = 505;

    const pendingReportObj = {
        report_id: NEW_REPORT_ID,
        city: REPORT_DATA.city,
        latitude: MOCK_COORDS.lat,
        longitude: MOCK_COORDS.lng,
        reported_at: REPORT_DATA.date,
        description: REPORT_DATA.description,
        reporter_name: REPORT_DATA.reporter_name,
        is_validated: 0,
        landslide_id: null,
        image_url: null
    };

    const validatedLandslideObj = {
        landslide_id: NEW_LANDSLIDE_ID,
        latitude: MOCK_COORDS.lat,
        longitude: MOCK_COORDS.lng,
        landslide_date: REPORT_DATA.date,
        image_url: 'test_folder'
    };

    beforeEach(() => {
        cy.viewport(1280, 800);
    });

    it('Completes the full lifecycle: User Report -> Admin Validate -> Map View', () => {

        // ======================================================
        // PHASE 1: USER SUBMISSION
        // ======================================================
        // Capture start time before the first async command
        cy.then(() => {
            timers.submissionStart = Date.now();
        });


        cy.intercept('POST', `${API_URL}/reports`, {
            statusCode: 201,
            body: { message: 'Report created', report_id: NEW_REPORT_ID }
        }).as('submitReport');

        cy.visit('/reportar', {
            onBeforeLoad(win) {
                cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
                    return cb({ coords: { latitude: MOCK_COORDS.lat, longitude: MOCK_COORDS.lng } });
                });
            }
        });

        cy.get('input[name="name"]').type(REPORT_DATA.reporter_name);
        cy.get('input[name="date"]').type(REPORT_DATA.date);
        cy.get('textarea[name="description"]').type(REPORT_DATA.description);
        cy.get('select[name="pueblo"]').select(REPORT_DATA.city);
        cy.get('input[name="allowLocation"]').check();

        // Wait for map to render before submitting
        cy.get('.esri-view-root canvas', { timeout: 20000 })
            .should('have.length.greaterThan', 0);

        cy.contains('button', 'Enviar Reporte').click();

        // The submission phase ends when the API response is received and success message is displayed
        cy.wait('@submitReport').then((interception) => {
            const body = interception.request.body;
            expect(body.city).to.equal(REPORT_DATA.city);
            expect(body.description).to.equal(REPORT_DATA.description);
            expect(parseFloat(body.latitude)).to.be.closeTo(MOCK_COORDS.lat, 0.001);
        });

        cy.contains('¡Reporte e imágenes enviados exitosamente!').should('be.visible')
            .then(() => {
                timers.submissionEnd = Date.now();
                cy.log(`Phase 1 (Submission) Duration: ${timers.submissionEnd - timers.submissionStart} ms`);
            });


        // ======================================================
        // PHASE 2: ADMIN VALIDATION
        // ======================================================
        // Start time for Admin phase
        cy.then(() => {
            timers.adminStart = Date.now();
        });

        const fakeHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
        const fakePayload = 'eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20ifQ';
        const fakeSignature = 'signature';
        const adminToken = `${fakeHeader}.${fakePayload}.${fakeSignature}`;
        const adminId = 1;

        cy.intercept('POST', `${API_URL}/admins/login`, {
            statusCode: 200,
            body: { token: adminToken }
        }).as('adminLogin');

        cy.intercept('GET', `${API_URL}/admins/${adminId}`, {
            statusCode: 200,
            body: { id: adminId, email: 'admin@test.com', isAuthorized: 1 }
        }).as('checkAuth');

        cy.intercept('GET', `${API_URL}/reports`, {
            statusCode: 200,
            body: [pendingReportObj]
        }).as('getReports');

        cy.intercept('POST', `${API_URL}/landslides`, {
            statusCode: 201,
            body: { id: NEW_LANDSLIDE_ID }
        }).as('createLandslide');

        cy.intercept('PUT', `${API_URL}/reports/${NEW_REPORT_ID}`, {
            statusCode: 200,
            body: { message: 'Updated' }
        }).as('updateReport');

        cy.visit('/cms/login');
        cy.get('input[placeholder="Correo Electrónico"]').type('admin@test.com');
        cy.get('input[placeholder="Contraseña"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.wait('@adminLogin');

        cy.visit('/cms/reportes', {
            onBeforeLoad(win) {
                const fakePayload = 'eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20ifQ==';
                const fakeToken = `header.${fakePayload}.signature`;
                win.localStorage.setItem('cmsAdmin', fakeToken);
            }
        });

        cy.wait('@getReports');
        cy.contains('Reportes Ciudadanos').should('be.visible');

        cy.contains('td', REPORT_DATA.city).parent().within(() => {
            cy.contains('Pendiente').should('be.visible');
            cy.get('button[title="Validar / Editar"]').click();
        });

        cy.contains('Validar Reporte').should('be.visible');
        cy.get('select[name="is_validated"]').select('1');
        cy.get('input[name="latitude"]').should('have.value', MOCK_COORDS.lat);

        cy.contains('button', 'Guardar Cambios').click();
        cy.get('.swal2-confirm').click();

        cy.wait('@createLandslide').then((i) => {
            // Assert against string for robustness, as noted in previous response
            expect(i.request.body.latitude).to.eq(MOCK_COORDS.lat); 
        });

        cy.wait('@updateReport').then((i) => {
            expect(i.request.body.is_validated).to.eq(1);
            expect(i.request.body.landslide_id).to.eq(NEW_LANDSLIDE_ID);
        });

        cy.contains('Reporte actualizado').should('be.visible')
            .then(() => {
                timers.adminEnd = Date.now();
                cy.log(`Phase 2 (Admin Validation) Duration: ${timers.adminEnd - timers.adminStart} ms`);
            });


        // ======================================================
        // PHASE 3: PUBLIC MAP VISUALIZATION
        // ======================================================
        // Start time for Map phase
        cy.then(() => {
            timers.mapStart = Date.now();
        });

        cy.intercept('GET', `${API_URL}/landslides`, {
            statusCode: 200,
            body: [validatedLandslideObj]
        }).as('getLandslides');

        cy.intercept('GET', `${API_URL}/stations`, []).as('getStations');

        cy.visit('/mapa-interactivo');

        cy.contains('Acepto | Agree').click();

        const currentYear = new Date().getFullYear().toString();

        cy.get('button[title="History"]').click();

        cy.get('.filters')
            .contains('label', currentYear)
            .find('input[type="checkbox"]')
            .check();

        cy.wait('@getLandslides');

        cy.get('.leaflet-marker-icon')
            .should('have.attr', 'src')
            .and('include', 'green-location-pin');

        cy.get('.leaflet-marker-icon').first().click({ force: true });

        const date = new Date(REPORT_DATA.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        cy.contains(formattedDate).should('be.visible')
            .then(() => {
                timers.mapEnd = Date.now();
                cy.log(`Phase 3 (Map Visualization) Duration: ${timers.mapEnd - timers.mapStart} ms`);
            });

    });

    after(() => {
        // Must use cy.then() here to ensure this runs after all command queue items (including the last .then())
        cy.then(() => {
            timers.end = Date.now();

            const submission = timers.submissionEnd - timers.submissionStart;
            const admin = timers.adminEnd - timers.adminStart;
            const map = timers.mapEnd - timers.mapStart;
            const total = timers.end - timers.start;

            const summary = `
================= E2E SUMMARY =================
Phase 1: Submission           ${submission} ms
Phase 2: Admin Validation     ${admin} ms
Phase 3: Map Visualization    ${map} ms
------------------------------------------------
Total E2E Duration            ${total} ms
================================================
`;

            // If cy.task('log') exists, report to console & mochawesome
            cy.task('log', summary, { log: false });

            // Fallback for console
            // eslint-disable-next-line no-console
            console.log(summary);
        });
    });
});
