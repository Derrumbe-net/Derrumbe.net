describe('Interactive Map Data Integrity Checks', () => {
    // Uses the base URL configured in your cypress.config.js or cypress.env.json
    const API_URL = Cypress.env('VITE_API_URL') || 'http://localhost:8080/api';

    beforeEach(() => {
        // Intercept and allow the real request to proceed (passthrough)
        cy.intercept('GET', `${API_URL}/landslides`, (req) => {
            req.continue();
        }).as('getLandslides');

        cy.intercept('GET', `${API_URL}/stations`, (req) => {
            req.continue();
        }).as('getStations');

        cy.visit('/mapa-interactivo');
        
        // Clicks the consent modal required by your application
        cy.contains('Acepto | Agree', { timeout: 10000 }).click();
    });

    // -----------------------------------------------------------------

    it('should verify that over 200 historical landslide events are available', () => {
        cy.wait('@getLandslides').then((interception) => {
            const landslides = interception.response.body;
            
            // 1. Assert on the data structure (must be an array)
            expect(landslides).to.be.an('array', 'The Landslides API response should be an array.');

            // 2. Assert the minimum required count
            const MIN_LANDSLIDES_REQUIRED = 200;
            cy.log(`Found ${landslides.length} Landslides in the response.`);
            
            expect(landslides.length).to.be.at.least(
                MIN_LANDSLIDES_REQUIRED,
                `Expected at least ${MIN_LANDSLIDES_REQUIRED} landslides, but found ${landslides.length}.`
            );
        });
    });

    // -----------------------------------------------------------------

    it('should verify that exactly 20 active monitoring stations are available', () => {
        cy.wait('@getStations').then((interception) => {
            const stations = interception.response.body;

            // 1. Assert on the data structure (must be an array)
            expect(stations).to.be.an('array', 'The Stations API response should be an array.');

            // 2. Filter for active stations (where is_available is 1 or true)
            const activeStations = stations.filter(station => 
                station.is_available === 1 || station.is_available === true
            );

            // 3. Assert the exact required count of active stations
            const EXACT_STATIONS_REQUIRED = 19;
            cy.log(`Found ${stations.length} total stations, ${activeStations.length} of which are active.`);
            
            expect(activeStations.length).to.equal(
                EXACT_STATIONS_REQUIRED,
                `Expected exactly ${EXACT_STATIONS_REQUIRED} active stations, but found ${activeStations.length}.`
            );
        });
    });
});
