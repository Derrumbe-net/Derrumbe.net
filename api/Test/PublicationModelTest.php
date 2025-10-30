<?php

use PHPUnit\Framework\TestCase;
use DerrumbeNet\Model\Publication;

class PublicationModelTest extends TestCase
{
    private $stmtMock;
    private $pdoMock;
    private $publicationModel;

    protected function setUp(): void
    {
        $this->stmtMock = $this->createMock(PDOStatement::class);

        $this->pdoMock = $this->createMock(PDO::class);
        $this->pdoMock->method('prepare')->willReturn($this->stmtMock);
        $this->pdoMock->method('query')->willReturn($this->stmtMock);
        $this->pdoMock->method('lastInsertId')->willReturn('123');

        $this->publicationModel = new Publication($this->pdoMock);
    }

    public function testCreatePublicationSuccess()
    {
        $data = ['admin_id' => 1, 'title' => 'Test', /* ... */];

        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->publicationModel->createPublication($data);
        $this->assertEquals('123', $result);
    }

    public function testCreatePublicationFailure()
    {
        $data = [/* ... */];
        $this->stmtMock->method('execute')->willReturn(false);

        $result = $this->publicationModel->createPublication($data);
        $this->assertFalse($result);
    }

    public function testCreatePublicationThrowsException()
    {
        $data = [/* ... */];
        $this->stmtMock->method('execute')->will($this->throwException(new PDOException()));

        $result = $this->publicationModel->createPublication($data);
        $this->assertFalse($result);
    }

    public function testGetPublicationByIdFound()
    {
        $expectedData = ['publication_id' => 42, 'title' => 'Test Pub'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $result = $this->publicationModel->getPublicationById(42);
        $this->assertEquals($expectedData, $result);
    }

    public function testGetPublicationByIdNotFound()
    {
        $this->stmtMock->method('fetch')->willReturn(false);

        $result = $this->publicationModel->getPublicationById(99);
        $this->assertFalse($result);
    }

    public function testGetAllPublications()
    {
        $expectedData = [/* ... */];
        $this->stmtMock->method('fetchAll')->willReturn($expectedData);
        $result = $this->publicationModel->getAllPublications();
        $this->assertEquals($expectedData, $result);
    }

    public function testGetAllPublicationsByOldest()
    {
        $expectedData = [/* ... */];
        $this->stmtMock->method('fetchAll')->willReturn($expectedData);
        $result = $this->publicationModel->getAllPublicationsByOldest();
        $this->assertEquals($expectedData, $result);
    }

    public function testGetAllPublicationsByLatest()
    {
        $expectedData = [/* ... */];
        $this->stmtMock->method('fetchAll')->willReturn($expectedData);
        $result = $this->publicationModel->getAllPublicationsByLatest();
        $this->assertEquals($expectedData, $result);
    }

    public function testUpdatePublicationSuccess()
    {
        $data = ['admin_id' => 1, 'title' => 'Updated', /* ... */];
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->publicationModel->updatePublication(1, $data);
        $this->assertTrue($result);
    }

    public function testDeletePublicationSuccess()
    {
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->publicationModel->deletePublication(1);
        $this->assertTrue($result);
    }
}