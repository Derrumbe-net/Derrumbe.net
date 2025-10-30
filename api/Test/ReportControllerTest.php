<?php
namespace DerrumbeNet\Test;

use PDOException;
use PDOStatement;
use PDO;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use DerrumbeNet\Controller\ReportController;

class ReportControllerTest extends TestCase
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

        $this->controller = new ReportController($this->pdoMock);
        $this->response = new Response();
    }

    private function createMockRequest($body)
    {
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn($body);
        return $request;
    }

    public function testCreateReportSuccess()
    {
        $data = ['landslide_id' => 1, 'city' => 'Mayaguez'];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->createReport($request, $this->response);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Report created","id":"123"}',
            (string) $response->getBody()
        );
    }

    public function testCreateReportFailure()
    {
        $data = [/* ... */];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->createReport($request, $this->response);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }

    public function testGetReportFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];
        $expectedData = ['report_id' => 42, 'city' => 'Mayaguez'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $response = $this->controller->getReport($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testGetReportNotFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 99];

        $this->stmtMock->method('fetch')->willReturn(false);

        $response = $this->controller->getReport($request, $this->response, $args);

        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Not found"}',
            (string) $response->getBody()
        );
    }

    public function testGetAllReports()
    {
        $request = $this->createMock(Request::class);
        $expectedData = [
            ['report_id' => 1],
            ['report_id' => 2]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($expectedData);

        $response = $this->controller->getAllReports($request, $this->response);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testUpdateReportSuccess()
    {
        $data = ['landslide_id' => 1, 'city' => 'Cabo Rojo'];
        $request = $this->createMockRequest($data);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->updateReport($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Updated"}',
            (string) $response->getBody()
        );
    }

    public function testUpdateReportFailure()
    {
        $data = [/* ... */];
        $request = $this->createMockRequest($data);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->updateReport($request, $this->response, $args);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }

    public function testDeleteReportSuccess()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->deleteReport($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Deleted"}',
            (string) $response->getBody()
        );
    }

    public function testDeleteReportFailure()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->deleteReport($request, $this->response, $args);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }
}