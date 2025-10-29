<?php
require __DIR__ . '/./vendor/autoload.php';
require_once __DIR__ . '/./Config/Database.php';
use Slim\Factory\AppFactory;

$app = AppFactory::create();

// Middleware to parse JSON body
$app->addBodyParsingMiddleware();

// Database connection
$db = Database::getConnection();

$basePath = rtrim(str_ireplace('index.php', '', $_SERVER['SCRIPT_NAME']), '/');
$app->setBasePath($basePath);

// Load routes
(require __DIR__ . '/./Route/AdminRoutes.php')($app, $db);
(require __DIR__ . '/./Route/LandslideRoutes.php')($app, $db);
(require __DIR__ . '/./Route/PublicationRoutes.php')($app, $db);
(require __DIR__ . '/./Route/ProjectRoutes.php')($app, $db);
(require __DIR__ . '/./Route/StationInfoRoutes.php')($app, $db);
(require __DIR__ . '/./Route/ReportRoutes.php')($app, $db);

// Error handling middleware
$app->addErrorMiddleware(true, true, true);

$app->run();
