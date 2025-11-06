<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use DerrumbeNet\Controller\LandslideController;

return function (App $app, $db) {
    $landslideController = new LandslideController($db);

    $app->group('/landslides', function (RouteCollectorProxy $group) use ($landslideController) {
        $group->post('', [$landslideController, 'createLandslide']);
        $group->get('', [$landslideController, 'getAllLandslides']);
        $group->get('/{id}', [$landslideController, 'getLandslide']);
        $group->put('/{id}', [$landslideController, 'updateLandslide']);
        $group->delete('/{id}', [$landslideController, 'deleteLandslide']);
    });
};
