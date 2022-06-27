import {DistanceUnits, GeoJsonRequest} from './requests'
import {Context}                       from '@azure/functions'
import {fetch}                         from 'cross-fetch'


type Point = {
    type: 'Point',
    coordinates: [lat: number, lng: number, alt?: number]
}

// Referring to https://qiita.com/a_nishimura/items/6c2642343c0af832acd4#%E5%AE%9F%E8%A3%85%E6%96%B9%E6%B3%95-1
function getDistance(p1: Point, p2: Point, unit: DistanceUnits = DistanceUnits.kilometers): number {
    const [lng1, lat1, lng2, lat2] = [...p1.coordinates, ...p2.coordinates]
    const theta = lng1 - lng2
    const dist = rad2deg(Math.acos(Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta))))
    const miles = dist * 60 * 1.1515
    console.log(miles)
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

function rad2deg(radian: number): number {
    return radian * (180 / Math.PI)
}

function deg2rad(degrees: number): number {
    return degrees * (Math.PI / 180)
}

export async function geoJson(context: Context, request: GeoJsonRequest): Promise<object> {
    try {
        const response = await fetch('https://data.sfgov.org/resource/rqzj-sfat.geojson')
        const body = await response.json()

        if (!('features' in body)) return {
            type: body.type,
            features: []
        }

        const features = Array.isArray(body.features) ? body.features : []
        body.features = features.filter(feature => {
            if (!('geometry' in feature)) return false
            const distance = getDistance({
                type: 'Point',
                coordinates: request.location
            }, feature.geometry, request.unit)
            return distance <= request.distance
        }).map(feature => ({
            type: feature.type,
            geometry: feature.geometry
        }))
        return body
    } catch (err) {
        context.log(err)
        throw err
    }
}