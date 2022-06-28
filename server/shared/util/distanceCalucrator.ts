import {DistanceUnits} from '../foodTrucks/requests'
import {Point}         from '../foodTrucks/geoJson'

export class DistanceCalculator {
    // Referring to https://qiita.com/a_nishimura/items/6c2642343c0af832acd4#%E5%AE%9F%E8%A3%85%E6%96%B9%E6%B3%95-1
    static calculate(p1: Point, p2: Point, unit: DistanceUnits = DistanceUnits.kilometers): number {
        const [lng1, lat1, lng2, lat2] = [...p1.coordinates, ...p2.coordinates]
        const theta = lng1 - lng2
        const dist = this.rad2deg(Math.acos(Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.cos(this.deg2rad(theta))))
        const miles = dist * 60 * 1.1515
        switch (unit) {
            case DistanceUnits.kilometers:
                return (miles * 1.609344)
            case DistanceUnits.meters:
                return (miles / 1000 * 1.609344)
            case DistanceUnits.miles:
            default:
                return miles
        }
    }

    private static rad2deg(radian: number): number {
        return radian * (180 / Math.PI)
    }

    private static deg2rad(degrees: number): number {
        return degrees * (Math.PI / 180)
    }
}