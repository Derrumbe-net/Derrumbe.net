<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

require_once __DIR__ . '/../Controller/PublicationController.php';

return function (App $app, $db) {
    $publicationController = new PublicationController($db);

    $app->group('/publications', function (RouteCollectorProxy $group) use ($publicationController) {
        $group->post('', [$publicationController, 'createPublication']);
        $group->get('', [$publicationController, 'getAllPublications']);
        $group->get('/{id}', [$publicationController, 'getPublication']);
        $group->put('/{id}', [$publicationController, 'updatePublication']);
        $group->delete('/{id}', [$publicationController, 'deletePublication']);
    });
};
