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
            p1: {type: 'Point', coordinates: [35.65989705529307, 139.74540992797273]},
            p2: {type: 'Point', coordinates: [35.71597226456347, 139.79682827491808]},
            expect: 7.4
        },
        {
            p1: {type: 'Point', coordinates: [35.65620686400929, 139.60546915079436]},
            p2: {type: 'Point', coordinates: [35.67150408124051, 139.5835162902813]},
            expect: 2.6
        },
        {
            p1: {type: 'Point', coordinates: [35.95412110573167, 140.24778025446935]},
            p2: {type: 'Point', coordinates: [36.420092264072224, 139.48457252527317]},
            expect: 85.7
        },
        {
            p1: {type: 'Point', coordinates: [79.770471787886, -53.03916081256033]},
            p2: {type: 'Point', coordinates: [78.42574253914447, -65.51962944226044]},
            expect: 301.7
        },
    ])('Calculate', value => {
        expect(DistanceCalculator.calculate(value.p1, value.p2)).toEqual(expect.closeTo(value.expect, 1))
    })
})