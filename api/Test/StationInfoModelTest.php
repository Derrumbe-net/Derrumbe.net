<?php

use PHPUnit\Framework\TestCase;
use DerrumbeNet\Model\StationInfo;

class StationInfoModelTest extends TestCase
{
    private $stmtMock;
    private $pdoMock;
    private $stationInfoModel;

    protected function setUp(): void
    {
        $this->stmtMock = $this->createMock(PDOStatement::class);

        $this->pdoMock = $this->createMock(PDO::class);
        $this->pdoMock->method('prepare')->willReturn($this->stmtMock);
        $this->pdoMock->method('query')->willReturn($this->stmtMock);
        $this->pdoMock->method('lastInsertId')->willReturn('123');

        $this->stationInfoModel = new StationInfo($this->pdoMock);
    }

    public function testCreateStationInfoSuccess()
    {
        $data = ['admin_id' => 1, 'city' => 'Test', /* ... */];

        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->stationInfoModel->createStationInfo($data);
        $this->assertEquals('123', $result);
    }

    public function testCreateStationInfoFailure()
    {
        $data = [/* ... */];
        $this->stmtMock->method('execute')->willReturn(false);

        $result = $this->stationInfoModel->createStationInfo($data);
        $this->assertFalse($result);
    }

    public function testCreateStationInfoThrowsException()
    {
        $data = [/* ... */];
        $this->stmtMock->method('execute')->will($this->throwException(new PDOException()));

        $result = $this->stationInfoModel->createStationInfo($data);
        $this->assertFalse($result);
    }

    public function testGetStationInfoByIdFound()
    {
        $expectedData = ['station_id' => 42, 'city' => 'Test'];

        $this->stmtMock->method('fetch')->willReturn($expectedData);

        $result = $this->stationInfoModel->getStationInfoById(42);
        $this->assertEquals($expectedData, $result);
    }

    public function testGetStationInfoByIdNotFound()
    {
        $this->stmtMock->method('fetch')->willReturn(false);

        $result = $this->stationInfoModel->getStationInfoById(99);
        $this->assertFalse($result);
    }

    public function testGetAllStationInfos()
    {
        $expectedData = [/* ... */];
        $this->stmtMock->method('fetchAll')->willReturn($expectedData);
        $result = $this->stationInfoModel->getAllStationInfos();
        $this->assertEquals($expectedData, $result);
    }

    public function testUpdateStationInfoSuccess()
    {
        $data = ['admin_id' => 1, 'city' => 'Updated', /* ... */];
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->stationInfoModel->updateStationInfo(1, $data);
        $this->assertTrue($result);
    }

    public function testDeleteStationInfoSuccess()
    {
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->stationInfoModel->deleteStationInfo(1);
        $this->assertTrue($result);
    }
}