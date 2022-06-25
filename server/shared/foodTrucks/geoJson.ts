import {DistanceUnits, GeoJsonRequest} from "./requests"
import {Context}                       from "@azure/functions"
import {fetch}                         from "cross-fetch"


type Point = {
    type: 'Point',
    coordinates: [lat: number, lng: number, alt?: number]
}

function getDistance(p1: Point, p2: Point, unit: DistanceUnits = DistanceUnits.kilometers): number {
    const [lng1, lat1, lng2, lat2] = [...p1.coordinates, ...p2.coordinates]
    console.log(lng1, lat1, lng2, lat2)

    const theta = lng1 - lng2

    const aaa = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta))
    //console.log(aaa)
    const bbb = Math.acos(aaa)
    //console.log(bbb)
    const dist = rad2deg(bbb)

    //console.log(dist)
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
            metadata: body.metadata,
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
        })
        return body
    } catch (err) {
        context.log(err)
        throw err
    }
}