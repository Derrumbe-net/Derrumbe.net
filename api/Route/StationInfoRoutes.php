<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use DerrumbeNet\Controller\StationInfoController;

return function (App $app, $db) {
    $stationInfoController = new StationInfoController($db);

    $app->group('/stations', function (RouteCollectorProxy $group) use ($stationInfoController) {
        $group->post('', [$stationInfoController, 'createStation']);
        $group->get('', [$stationInfoController, 'getAllStations']);
        $group->get('/{id}', [$stationInfoController, 'getStation']);
        $group->put('/{id}', [$stationInfoController, 'updateStation']);
        $group->delete('/{id}', [$stationInfoController, 'deleteStation']);
    });
};
