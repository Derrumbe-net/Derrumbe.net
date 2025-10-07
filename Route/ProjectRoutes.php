<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
require_once __DIR__ . '/../Controller/ProjectController.php';

return function (App $app, $db) {
    $controller = new ProjectController($db);

    $app->group('/projects', function (RouteCollectorProxy $group) use ($controller) {
        $group->post('', [$controller, 'createProject']);
        $group->get('', [$controller, 'getAllProjects']);
        $group->get('/{id}', [$controller, 'getProject']);
        $group->put('/{id}', [$controller, 'updateProject']);
        $group->delete('/{id}', [$controller, 'deleteProject']);
    });
};
