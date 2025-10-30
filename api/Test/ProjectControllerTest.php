<?php
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use DerrumbeNet\Controller\ProjectController;
use DerrumbeNet\Model\Project; // Model mock is not strictly needed here, but good practice

class ProjectControllerTest extends TestCase
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

        $this->controller = new ProjectController($this->pdoMock);
        $this->response = new Response();
    }

    private function createMockRequest($body)
    {
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn($body);
        return $request;
    }

    public function testCreateProjectSuccess()
    {
        $data = ['admin_id' => 1, 'title' => 'New Project'];
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->createProject($request, $this->response);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Project created","id":"123"}',
            (string) $response->getBody()
        );
    }

    public function testCreateProjectFailure()
    {
        $data = ['admin_id' => 1]; // Incomplete data
        $request = $this->createMockRequest($data);

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->createProject($request, $this->response);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }

    public function testGetProjectFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];
        $expectedData = ['project_id' => 42, 'title' => 'Test Project'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $response = $this->controller->getProject($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testGetProjectNotFound()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 99];

        $this->stmtMock->method('fetch')->willReturn(false);

        $response = $this->controller->getProject($request, $this->response, $args);

        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Not found"}',
            (string) $response->getBody()
        );
    }

    public function testGetAllProjects()
    {
        $request = $this->createMock(Request::class);
        $expectedData = [
            ['project_id' => 1],
            ['project_id' => 2]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($expectedData);

        $response = $this->controller->getAllProjects($request, $this->response);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode($expectedData),
            (string) $response->getBody()
        );
    }

    public function testUpdateProjectSuccess()
    {
        $data = ['admin_id' => 1, 'title' => 'Updated Project'];
        $request = $this->createMockRequest($data);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->updateProject($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Updated"}',
            (string) $response->getBody()
        );
    }

    public function testUpdateProjectFailure()
    {
        $data = ['admin_id' => 1, 'title' => 'Updated Project'];
        $request = $this->createMockRequest($data);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->updateProject($request, $this->response, $args);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }

    public function testDeleteProjectSuccess()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(true);

        $response = $this->controller->deleteProject($request, $this->response, $args);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"message":"Deleted"}',
            (string) $response->getBody()
        );
    }

    public function testDeleteProjectFailure()
    {
        $request = $this->createMock(Request::class);
        $args = ['id' => 42];

        $this->stmtMock->method('execute')->willReturn(false);

        $response = $this->controller->deleteProject($request, $this->response, $args);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            '{"error":"Failed"}',
            (string) $response->getBody()
        );
    }
}