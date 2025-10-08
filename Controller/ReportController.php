<?php
require_once __DIR__ . '/../Model/Report.php';

class ReportController {
    private $reportModel;
    public function __construct($db){ $this->reportModel = new Report($db); }

    private function jsonResponse($response, $data, $status=200){
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus($status);
    }

    public function createReport($request,$response){
        $id = $this->reportModel->createReport($request->getParsedBody());
        return $id ? $this->jsonResponse($response,['message'=>'Report created','id'=>$id],201)
                   : $this->jsonResponse($response,['error'=>'Failed'],500);
    }

    public function getAllReports($request,$response){
        return $this->jsonResponse($response,$this->reportModel->getAllReports());
    }

    public function getReport($request,$response,$args){
        $rep = $this->reportModel->getReportById($args['id']);
        return $rep ? $this->jsonResponse($response,$rep)
                    : $this->jsonResponse($response,['error'=>'Not found'],404);
    }

    public function updateReport($request,$response,$args){
        $updated = $this->reportModel->updateReport($args['id'],$request->getParsedBody());
        return $updated ? $this->jsonResponse($response,['message'=>'Updated'])
                        : $this->jsonResponse($response,['error'=>'Failed'],500);
    }

    public function deleteReport($request,$response,$args){
        $deleted = $this->reportModel->deleteReport($args['id']);
        return $deleted ? $this->jsonResponse($response,['message'=>'Deleted'])
                        : $this->jsonResponse($response,['error'=>'Failed'],500);
    }
}
