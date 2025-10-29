<?php

use PHPUnit\Framework\TestCase;
use DerrumbeNet\Model\Project;

class ProjectModelTest extends TestCase
{
    private $stmtMock;
    private $pdoMock;
    private $projectModel;

    protected function setUp(): void
    {
        $this->stmtMock = $this->createMock(PDOStatement::class);

        $this->pdoMock = $this->createMock(PDO::class);
        $this->pdoMock->method('prepare')->willReturn($this->stmtMock);
        $this->pdoMock->method('query')->willReturn($this->stmtMock);
        $this->pdoMock->method('lastInsertId')->willReturn('123');

        $this->projectModel = new Project($this->pdoMock);
    }

    public function testCreateProjectSuccess()
    {
        $data = ['admin_id' => 1, 'title' => 'Test', /* ... other fields ... */];

        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->projectModel->createProject($data);
        $this->assertEquals('123', $result);
    }

    public function testCreateProjectFailure()
    {
        $data = [/* ... */];
        $this->stmtMock->method('execute')->willReturn(false);

        $result = $this->projectModel->createProject($data);
        $this->assertFalse($result);
    }

    public function testCreateProjectThrowsException()
    {
        $data = [/* ... */];
        $this->stmtMock->method('execute')->will($this->throwException(new PDOException()));

        $result = $this->projectModel->createProject($data);
        $this->assertFalse($result);
    }

    public function testGetProjectByIdFound()
    {
        $expectedData = ['project_id' => 42, 'title' => 'Test Project'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $result = $this->projectModel->getProjectById(42);
        $this->assertEquals($expectedData, $result);
    }

    public function testGetProjectByIdNotFound()
    {
        $this->stmtMock->method('fetch')->willReturn(false);

        $result = $this->projectModel->getProjectById(99);
        $this->assertFalse($result);
    }

    public function testGetAllProjects()
    {
        $expectedData = [
            ['project_id' => 1],
            ['project_id' => 2]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($expectedData);

        $result = $this->projectModel->getAllProjects();
        $this->assertEquals($expectedData, $result);
    }

    public function testGetProjectsByStatus()
    {
        $expectedData = [
            ['project_id' => 1, 'project_status' => 'active']
        ];

        $this->stmtMock->method('fetchAll')->willReturn($expectedData);

        $result = $this->projectModel->getProjectsByStatus('active');
        $this->assertEquals($expectedData, $result);
    }

    public function testUpdateProjectSuccess()
    {
        $data = ['admin_id' => 1, 'title' => 'Updated', /* ... other fields ... */];

        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->projectModel->updateProject(1, $data);
        $this->assertTrue($result);
    }

    public function testUpdateProjectFailure()
    {
        $data = [/* ... */];
        $this->stmtMock->method('execute')->willReturn(false);
        $result = $this->projectModel->updateProject(1, $data);
        $this->assertFalse($result);
    }

    public function testDeleteProjectSuccess()
    {
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->projectModel->deleteProject(1);
        $this->assertTrue($result);
    }

    public function testDeleteProjectFailure()
    {
        $this->stmtMock->method('execute')->willReturn(false);
        $result = $this->projectModel->deleteProject(1);
        $this->assertFalse($result);
    }
}