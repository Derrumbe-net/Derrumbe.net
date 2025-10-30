<?php
namespace DerrumbeNet\Test;
use PDOException;
use PDOStatement;
use PDO;
use PHPUnit\Framework\TestCase;
use DerrumbeNet\Model\Landslide;

class LandslideModelTest extends TestCase
{
    private $stmtMock;
    private $landslideModel;

    protected function setUp(): void
    {
        $this->stmtMock = $this->createMock(PDOStatement::class);

        $pdoMock = $this->createMock(PDO::class);
        $pdoMock->method('prepare')->willReturn($this->stmtMock);
        $pdoMock->method('query')->willReturn($this->stmtMock);
        $pdoMock->method('lastInsertId')->willReturn('123');

        $this->landslideModel = new Landslide($pdoMock);
    }

    public function testCreateLandslideSuccess()
    {
        $data = [ /* ... */ ];

        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->landslideModel->createLandslide($data);
        $this->assertEquals('123', $result);
    }

    public function testCreateLandslideFailure()
    {
        $data = [ /* ... */ ];

        $this->stmtMock->method('execute')->willReturn(false);

        $result = $this->landslideModel->createLandslide($data);
        $this->assertFalse($result);
    }

    public function testCreateLandslideThrowsException()
    {
        $data = [ /* ... */ ];
        $this->stmtMock->method('execute')->will($this->throwException(new PDOException()));

        $result = $this->landslideModel->createLandslide($data);
        $this->assertFalse($result);
    }

    public function testGetLandslideByIdFound()
    {
        $expectedData = ['landslide_id' => 42, 'city' => 'Mayagüez'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $result = $this->landslideModel->getLandslideById(42);
        $this->assertEquals($expectedData, $result);
    }

    public function testGetLandslideByIdNotFound()
    {
        $this->stmtMock->method('fetch')->willReturn(false);

        $result = $this->landslideModel->getLandslideById(99);
        $this->assertFalse($result);
    }

    public function testGetAllLandslides()
    {
        $expectedData = [
            ['landslide_id' => 1, 'city' => 'Location A'],
            ['landslide_id' => 2, 'city' => 'Location B']
        ];

        $this->stmtMock->method('fetchAll')->willReturn($expectedData);

        $result = $this->landslideModel->getAllLandslides();
        $this->assertEquals($expectedData, $result);
    }

    public function testUpdateLandslideSuccess()
    {
        $data = [ /* ... */ ];

        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->landslideModel->updateLandslide(1, $data);
        $this->assertTrue($result);
    }

    public function testDeleteLandslideSuccess()
    {
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->landslideModel->deleteLandslide(1);
        $this->assertTrue($result);
    }
}