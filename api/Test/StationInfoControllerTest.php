<?php
namespace DerrumbeNet\Test;

use PDOException;
use PDOStatement;
use PDO;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use DerrumbeNet\Controller\StationInfoController;

class StationInfoControllerTest extends TestCase
{
    private $stmtMock;
    private $pdoMock;
    private $controller;
    private $response;

    protected function setUp(): void
    {
        $this->stmtMock = $this->createMock(PDOStatement::class);

        $this->pdoMock = $this->createMock(PDO::class);
        $this->pdoMock->method('prepare')->willReturn($this->stmtMock);
        $this->pdoMock->method('query')->willReturn($this->stmtMock);
        $this->pdoMock->method('lastInsertId')->willReturn('123');

        $this->controller = new StationInfoController($this->pdoMock);
        $this->response = new Response();
    }

    private function createMockRequest($body)
    {
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn($body);
        return $request;
    }

    public function testCreateStationSuccess()
    {
        $data = ['admin_id' => 1, 'city' => 'Test Station'];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->createStation($request, $this->response);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Station created","id":"123"}',
            (string) $response->getBody()
        );
    }

    public function testCreateStationFailure()
    {
        $data = [/* ... */];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->createStation($request, $this->response);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }

    public function testGetStationFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];
        $expectedData = ['station_id' => 42, 'city' => 'Test Station'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $response = $this->controller->getStation($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testGetStationNotFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 99];

        $this->stmtMock->method('fetch')->willReturn(false);

        $response = $this->controller->getStation($request, $this->response, $args);

        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Not found"}',
            (string) $response->getBody()
        );
    }

    public function testGetAllStations()
    {
        $request = $this->createMock(Request::class);
        $expectedData = [
            ['station_id' => 1],
            ['station_id' => 2]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($expectedData);

        $response = $this->controller->getAllStations($request, $this->response);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testUpdateStationSuccess()
    {
        $data = ['admin_id' => 1, 'city' => 'Updated Station'];
        $request = $this->createMockRequest($data);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->updateStation($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Updated"}',
            (string) $response->getBody()
        );
    }

    public function testUpdateStationFailure()
    {
        $data = [/* ... */];
        $request = $this->createMockRequest($data);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->updateStation($request, $this->response, $args);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }

    public function testDeleteStationSuccess()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->deleteStation($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Deleted"}',
            (string) $response->getBody()
        );
    }

    public function testDeleteStationFailure()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->deleteStation($request, $this->response, $args);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }
}