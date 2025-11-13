<?php
namespace DerrumbeNet\Test;

use PDOException;
use PDOStatement;
use PDO;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use DerrumbeNet\Controller\PublicationController;

class PublicationControllerTest extends TestCase
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

        $this->controller = new PublicationController($this->pdoMock);
        $this->response = new Response();
    }

    private function createMockRequest($body)
    {
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn($body);
        return $request;
    }

    public function testCreatePublicationSuccess()
    {
        $data = ['admin_id' => 1, 'title' => 'New Publication'];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->createPublication($request, $this->response);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Publication created","id":"123"}',
            (string) $response->getBody()
        );
    }

    public function testCreatePublicationFailure()
    {
        $data = ['admin_id' => 1];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->createPublication($request, $this->response);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }

    public function testGetPublicationFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];
        $expectedData = ['publication_id' => 42, 'title' => 'Test Pub'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $response = $this->controller->getPublication($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testGetPublicationNotFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 99];

        $this->stmtMock->method('fetch')->willReturn(false);

        $response = $this->controller->getPublication($request, $this->response, $args);

        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Not found"}',
            (string) $response->getBody()
        );
    }

    public function testGetAllPublications()
    {
        $request = $this->createMock(Request::class);
        $expectedData = [
            ['publication_id' => 1],
            ['publication_id' => 2]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($expectedData);

        $response = $this->controller->getAllPublications($request, $this->response);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testUpdatePublicationSuccess()
    {
        $data = ['admin_id' => 1, 'title' => 'Updated Pub'];
        $request = $this->createMockRequest($data);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->updatePublication($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Updated"}',
            (string) $response->getBody()
        );
    }

    public function testUpdatePublicationFailure()
    {
        $data = ['admin_id' => 1, 'title' => 'Updated Pub'];
        $request = $this->createMockRequest($data);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->updatePublication($request, $this->response, $args);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }

    public function testDeletePublicationSuccess()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->deletePublication($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Deleted"}',
            (string) $response->getBody()
        );
    }

    public function testDeletePublicationFailure()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->deletePublication($request, $this->response, $args);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }
}