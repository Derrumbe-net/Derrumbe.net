<?php
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

require_once __DIR__ . '/../Controller/LandslideController.php';
require_once __DIR__ . '/../Model/Landslide.php';

class LandslideControllerTest extends TestCase
{
    private $stmtMock;
    private $controller;
    private $response;

    protected function setUp(): void
    {
        $this->stmtMock = $this->createMock(PDOStatement::class);

        $pdoMock = $this->createMock(PDO::class);
        $pdoMock->method('prepare')->willReturn($this->stmtMock);
        $pdoMock->method('query')->willReturn($this->stmtMock);
        $pdoMock->method('lastInsertId')->willReturn('123');

        $this->controller = new LandslideController($pdoMock);
        $this->response = new Response();
    }

    private function createMockRequest($body)
    {
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn($body);
        return $request;
    }

    public function testCreateLandslideSuccess()
    {
        $data = ['admin_id' => 1, 'latitude' => '18.2'];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->createLandslide($request, $this->response);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Landslide created","id":"123"}',
            (string) $response->getBody()
        );
    }

    public function testCreateLandslideFailure()
    {
        $data = ['admin_id' => 1];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->createLandslide($request, $this->response);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed to create"}',
            (string) $response->getBody()
        );
    }

    public function testGetLandslideFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];
        $expectedData = ['landslide_id' => 42, 'city' => 'Mayagüez'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $response = $this->controller->getLandslide($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testGetLandslideNotFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 99];

        $this->stmtMock->method('fetch')->willReturn(false);

        $response = $this->controller->getLandslide($request, $this->response, $args);

        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Not found"}',
            (string) $response->getBody()
        );
    }

    public function testGetAllLandslides()
    {
        $request = $this->createMock(Request::class);
        $expectedData = [
            ['landslide_id' => 1],
            ['landslide_id' => 2]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($expectedData);

        $response = $this->controller->getAllLandslides($request, $this->response);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }
}