<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

require_once __DIR__ . '/../Controller/AdminController.php';

return function (App $app, $db) {
    $adminController = new AdminController($db);

    $app->group('/admins', function (RouteCollectorProxy $group) use ($adminController) {
        $group->post('', [$adminController, 'createAdmin']);
        $group->get('', [$adminController, 'getAllAdmins']);
        $group->get('/{id}', [$adminController, 'getAdmin']);
        $group->put('/{id}/email', [$adminController, 'updateEmail']);
        $group->put('/{id}/password', [$adminController, 'updatePassword']);
        $group->delete('/{id}', [$adminController, 'deleteAdmin']);
    });
};
