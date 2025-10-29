<?php

namespace DerrumbeNet\Controller;

use DerrumbeNet\Model\StationInfo;

class StationInfoController {
    private StationInfo $stationInfoModel;
    public function __construct($db) { $this->stationInfoModel = new StationInfo($db); }

    private function jsonResponse($response, $data, $status=200){
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus($status);
    }

    public function createStation($request,$response){
        $id = $this->stationInfoModel->createStationInfo($request->getParsedBody());
        return $id ? $this->jsonResponse($response,['message'=>'Station created','id'=>$id],201)
                   : $this->jsonResponse($response,['error'=>'Failed'],500);
    }

    public function getAllStations($request,$response){
        return $this->jsonResponse($response,$this->stationInfoModel->getAllStationInfos());
    }

    public function getStation($request,$response,$args){
        $station = $this->stationInfoModel->getStationInfoById($args['id']);
        return $station ? $this->jsonResponse($response,$station)
                        : $this->jsonResponse($response,['error'=>'Not found'],404);
    }

    public function updateStation($request,$response,$args){
        $updated = $this->stationInfoModel->updateStationInfo($args['id'],$request->getParsedBody());
        return $updated ? $this->jsonResponse($response,['message'=>'Updated'])
                        : $this->jsonResponse($response,['error'=>'Failed'],500);
    }

    public function deleteStation($request,$response,$args){
        $deleted = $this->stationInfoModel->deleteStationInfo($args['id']);
        return $deleted ? $this->jsonResponse($response,['message'=>'Deleted'])
                        : $this->jsonResponse($response,['error'=>'Failed'],500);
    }
}
