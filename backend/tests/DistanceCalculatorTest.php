<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;

require_once __DIR__ . '/../DistanceCalculator.php';

final class DistanceCalculatorTest extends TestCase
{
    private DistanceCalculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new DistanceCalculator();
    }

    public function testSamePointReturnsZeroDistance(): void
    {
        $result = $this->calculator->calculate(52.2297, 21.0122, 52.2297, 21.0122);

        $this->assertSame(0.0, $result['meters']);
        $this->assertSame(0.0, $result['kilometers']);
    }

    public function testResultContainsRequiredKeys(): void
    {
        $result = $this->calculator->calculate(0, 0, 0, 0);

        $this->assertArrayHasKey('meters', $result);
        $this->assertArrayHasKey('kilometers', $result);
    }

    public function testKilometersEqualsMetersDividedByThousand(): void
    {
        $result = $this->calculator->calculate(52.2297, 21.0122, 50.0647, 19.9450);

        $this->assertEqualsWithDelta(
            $result['meters'] / 1000,
            $result['kilometers'],
            0.001
        );
    }

    public function testDistanceIsSymmetric(): void
    {
        $result1 = $this->calculator->calculate(52.2297, 21.0122, 50.0647, 19.9450);
        $result2 = $this->calculator->calculate(50.0647, 19.9450, 52.2297, 21.0122);

        $this->assertSame($result1['meters'], $result2['meters']);
    }

    public function testWarsawToKrakow(): void
    {
        // ~252 km (accepted geodetic reference)
        $result = $this->calculator->calculate(52.2297, 21.0122, 50.0647, 19.9450);

        $this->assertEqualsWithDelta(252_000, $result['meters'], 5_000);
        $this->assertEqualsWithDelta(252.0, $result['kilometers'], 5.0);
    }

    public function testPolarPoints(): void
    {
        // North Pole to South Pole — roughly half the Earth's circumference ≈ 20,015 km
        $result = $this->calculator->calculate(90, 0, -90, 0);

        $this->assertEqualsWithDelta(20_015_000, $result['meters'], 50_000);
    }

    public function testNegativeCoordinates(): void
    {
        // Buenos Aires to Sydney — roughly 11,800 km
        $result = $this->calculator->calculate(-34.6037, -58.3816, -33.8688, 151.2093);

        $this->assertEqualsWithDelta(11_800_000, $result['meters'], 200_000);
    }

    #[DataProvider('knownDistancesProvider')]
    public function testKnownCityDistances(
        float $lat1, float $lon1,
        float $lat2, float $lon2,
        float $expectedKm,
        float $toleranceKm
    ): void {
        $result = $this->calculator->calculate($lat1, $lon1, $lat2, $lon2);

        $this->assertEqualsWithDelta($expectedKm, $result['kilometers'], $toleranceKm);
    }

    public static function knownDistancesProvider(): array
    {
        return [
            'Warsaw → Wrocław'  => [52.2297, 21.0122, 51.1079, 17.0385, 297.0,  5.0],
            'Warsaw → Gdańsk'   => [52.2297, 21.0122, 54.3520, 18.6466, 305.0,  5.0],
            'Paris → Berlin'    => [48.8566,  2.3522, 52.5200, 13.4050, 878.0, 10.0],
            'NYC → London'      => [40.7128, -74.0060, 51.5074, -0.1278, 5570.0, 50.0],
        ];
    }
}
