import {GeoJsonRequest}     from './requests'
import {Context}            from '@azure/functions'
import {fetch}              from 'cross-fetch'
import {DistanceCalculator} from '../util/distanceCalucrator'

export type Point = {
    type: string,
    coordinates: [lat: number, lng: number]
}

export class GeoJson {
    static getFoodTracks() {
        return fetch('https://data.sfgov.org/resource/rqzj-sfat.geojson').then(res => res.json())
    }

    static async get(request: GeoJsonRequest, context?: Context): Promise<object> {
        try {
            const body = await this.getFoodTracks()

            if (!('features' in body)) return {
                type: body.type,
                features: []
            }

            const features = Array.isArray(body.features) ? body.features : []
            body.features = features.filter(feature => {
                if (!('geometry' in feature)) return false
                const distance = DistanceCalculator.calculate({
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
            context?.log(err)
            throw err
        }
    }
}

