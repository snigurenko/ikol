<?php

declare(strict_types=1);

class DistanceCalculator
{
    private const EARTH_RADIUS_METERS = 6_371_000;

    /**
     * Haversine formula — returns distance between two WGS-84 coordinates.
     *
     * @return array{meters: float, kilometers: float}
     */
    public function calculate(float $lat1, float $lon1, float $lat2, float $lon2): array
    {
        $lat1Rad    = deg2rad($lat1);
        $lat2Rad    = deg2rad($lat2);
        $deltaLat   = deg2rad($lat2 - $lat1);
        $deltaLon   = deg2rad($lon2 - $lon1);

        $a = sin($deltaLat / 2) ** 2
            + cos($lat1Rad) * cos($lat2Rad) * sin($deltaLon / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $meters = self::EARTH_RADIUS_METERS * $c;

        return [
            'meters'     => round($meters, 2),
            'kilometers' => round($meters / 1000, 4),
        ];
    }
}
