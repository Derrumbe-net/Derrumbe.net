<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

require_once __DIR__ . '/../Controller/ReportController.php';

return function (App $app, $db) {
    $controller = new ReportController($db);

    $app->group('/reports', function (RouteCollectorProxy $group) use ($controller) {
        $group->post('', [$controller, 'createReport']);
        $group->get('', [$controller, 'getAllReports']);
        $group->get('/{id}', [$controller, 'getReport']);
        $group->put('/{id}', [$controller, 'updateReport']);
        $group->delete('/{id}', [$controller, 'deleteReport']);
    });
};
