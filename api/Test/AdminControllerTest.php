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
    private $controller;
    private $response;

    protected function setUp(): void
    {
        // Mock PDOStatement
        $this->stmtMock = $this->createMock(PDOStatement::class);
        $this->stmtMock->method('execute')->willReturn(true);
        $this->stmtMock->method('fetch')->willReturn(false); // default
        $this->stmtMock->method('fetchAll')->willReturn([]);

        // Mock PDO
        $pdoMock = $this->getMockBuilder(PDO::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['prepare', 'lastInsertId'])
            ->getMock();
        $pdoMock->method('prepare')->willReturn($this->stmtMock);
        $pdoMock->method('lastInsertId')->willReturn('42');

        // Controller uses real Admin with mocked PDO
        $this->controller = new AdminController($pdoMock);
        $this->response = new Response();
    }

    public function testCreateAdminSuccess()
    {
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn([
            'email' => 'admin@test.com',
            'password' => '1234'
        ]);

        $response = $this->controller->createAdmin($request, $this->response);
        $body = (string) $response->getBody();

        $this->assertStringContainsString('Admin created', $body);
        $this->assertEquals(201, $response->getStatusCode());
    }

    public function testCreateAdminMissingEmail()
    {
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn([
            'password' => '1234'
        ]);

        $response = $this->controller->createAdmin($request, $this->response);
        $body = (string) $response->getBody();

        $this->assertStringContainsString('Email and Password are required', $body);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testGetAdminNotFound()
    {
        // Stub fetch to return false for getAdminById
        $this->stmtMock->method('fetch')->willReturn(false);

        $request = $this->createMock(Request::class);
        $response = $this->controller->getAdmin($request, $this->response, ['id' => 99]);
        $body = (string) $response->getBody();

        $this->assertStringContainsString('Admin not found', $body);
        $this->assertEquals(404, $response->getStatusCode());
    }

    public function testGetAdminFound()
    {
        $adminData = [
            'admin_id' => 1,
            'email' => 'admin@test.com',
            'password' => 'hashed'
        ];

        // Create a new statement mock for this test
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->method('execute')->willReturn(true);
        $stmtMock->method('fetch')->willReturn($adminData);

        // New PDO mock that returns this statement
        $pdoMock = $this->getMockBuilder(PDO::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['prepare', 'lastInsertId'])
            ->getMock();
        $pdoMock->method('prepare')->willReturn($stmtMock);
        $pdoMock->method('lastInsertId')->willReturn('42');

        $controller = new AdminController($pdoMock);
        $response = new Response();
        $request = $this->createMock(Request::class);

        $response = $controller->getAdmin($request, $response, ['id' => 1]);
        $body = (string) $response->getBody();

        $this->assertStringContainsString('admin@test.com', $body);
        $this->assertEquals(200, $response->getStatusCode());
    }
}
