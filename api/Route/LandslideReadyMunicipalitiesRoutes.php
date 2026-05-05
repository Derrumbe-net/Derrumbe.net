<?php

use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use DerrumbeNet\Controller\LandslideReadyMunicipalityController;
use DerrumbeNet\Model\LandslideReadyMunicipality;
use DerrumbeNet\Middleware\JwtMiddleware;

return function (App $app, $db) {
    $model      = new LandslideReadyMunicipality($db);
    $controller = new LandslideReadyMunicipalityController($model);

    $jwtSecret    = $_ENV['JWT_SECRET'];
    $jwtMiddleware = new JwtMiddleware($jwtSecret);

    // ---- Public routes ----
    $app->get('/landslideready-municipalities',      [$controller, 'getAll']);
    $app->get('/landslideready-municipalities/{id}', [$controller, 'getOne']);
    
    // ---- Protected routes ----
    $app->group('/landslideready-municipalities', function (RouteCollectorProxy $group) use ($controller) {
        $group->post('',        [$controller, 'create']);
        $group->put('/{id}',    [$controller, 'update']);
        $group->delete('/{id}', [$controller, 'delete']);
    })->add($jwtMiddleware);
};