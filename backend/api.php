<?php

declare(strict_types=1);

require_once __DIR__ . '/DistanceCalculator.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}

$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body.']);
    exit;
}

$fields = ['lat1', 'lon1', 'lat2', 'lon2'];

foreach ($fields as $field) {
    if (!array_key_exists($field, $input) || !is_numeric($input[$field])) {
        http_response_code(422);
        echo json_encode(['error' => "Field '{$field}' is missing or not a number."]);
        exit;
    }
}

$lat1 = (float) $input['lat1'];
$lon1 = (float) $input['lon1'];
$lat2 = (float) $input['lat2'];
$lon2 = (float) $input['lon2'];

if ($lat1 < -90 || $lat1 > 90 || $lat2 < -90 || $lat2 > 90) {
    http_response_code(422);
    echo json_encode(['error' => 'Latitude must be between -90 and 90.']);
    exit;
}

if ($lon1 < -180 || $lon1 > 180 || $lon2 < -180 || $lon2 > 180) {
    http_response_code(422);
    echo json_encode(['error' => 'Longitude must be between -180 and 180.']);
    exit;
}

$calculator = new DistanceCalculator();
$result     = $calculator->calculate($lat1, $lon1, $lat2, $lon2);

http_response_code(200);
echo json_encode($result);
