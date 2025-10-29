<?php

namespace DerrumbeNet\Test;

use PHPUnit\Framework\TestCase;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use DerrumbeNet\Controller\AdminController;
use DerrumbeNet\Model\Admin;
use PDO;
use PDOStatement;


class AdminControllerTest extends TestCase
{
    private $stmtMock;
    private AdminController $controller;
    private Response $response;

    protected function setUp(): void
    {
        $this->stmtMock = $this->createMock(PDOStatement::class);
        $this->stmtMock->method('execute')->willReturn(true);

        $pdoMock = $this->createMock(PDO::class);
        $pdoMock->method('prepare')->willReturn($this->stmtMock);
        $pdoMock->method('lastInsertId')->willReturn('42');

        $this->controller = new AdminController($pdoMock);

        $this->response = new Response();
    }

    private function createMockRequest($body)
    {
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn($body);
        return $request;
    }

    public function testCreateAdminSuccess()
    {
        $request = $this->createMockRequest([
            'email' => 'admin@test.com',
            'password' => '1234'
        ]);

        $response = $this->controller->createAdmin($request, $this->response);
        $body = (string) $response->getBody();

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString('{"message":"Admin created","id":"42"}', $body);
    }

    public function testCreateAdminMissingEmail()
    {
        $request = $this->createMockRequest(['password' => '1234']);
        $response = $this->controller->createAdmin($request, $this->response);
        $body = (string) $response->getBody();

        $this->assertStringContainsString('Email and Password are required', $body);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testGetAdminFound()
    {
        $adminData = [
            'admin_id' => 1,
            'email' => 'admin@test.com'
        ];

        $this->stmtMock->method('fetch')->willReturn($adminData);

        $request = $this->createMock(Request::class);
        $response = $this->controller->getAdmin($request, $this->response, ['id' => 1]);
        $body = (string) $response->getBody();

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode($adminData), $body);
    }

    public function testGetAdminNotFound()
    {
        $this->stmtMock->method('fetch')->willReturn(false);

        $request = $this->createMock(Request::class);
        $response = $this->controller->getAdmin($request, $this->response, ['id' => 99]);
        $body = (string) $response->getBody();

        $this->assertStringContainsString('Admin not found', $body);
        $this->assertEquals(404, $response->getStatusCode());
    }
}