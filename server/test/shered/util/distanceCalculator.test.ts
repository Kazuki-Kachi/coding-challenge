import {DistanceCalculator} from '../../../shared/util/distanceCalucrator'
import {Point}              from '../../../shared/foodTrucks/geoJson'

type TestType = {
    p1: Point,
    p2: Point,
    expect: number,
}
describe('Check DistanceCalculator', () => {
    it.each<TestType>([
        {
            p1: {type: 'Point', coordinates: [139.74540992797273, 35.65989705529307]},
            p2: {type: 'Point', coordinates: [139.79682827491808, 35.71597226456347]},
            expect: 7.8
        },
        {
            p1: {type: 'Point', coordinates: [139.60546915079436, 35.65620686400929]},
            p2: {type: 'Point', coordinates: [139.5835162902813, 35.67150408124051]},
            expect: 2.6
        },
        {
            p1: {type: 'Point', coordinates: [140.24778025446935, 35.95412110573167]},
            p2: {type: 'Point', coordinates: [139.48457252527317, 36.420092264072224]},
            expect: 85.9
        },
        {
            p1: {type: 'Point', coordinates: [-53.03916081256033, 79.770471787886]},
            p2: {type: 'Point', coordinates: [-65.51962944226044, 78.42574253914447]},
            expect: 301.2
        },
    ])('Calculate', value => {
        expect(DistanceCalculator.calculate(value.p1, value.p2)).toBeCloseTo(value.expect, 1)
    })
})