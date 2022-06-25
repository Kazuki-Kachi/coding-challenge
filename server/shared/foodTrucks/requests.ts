import {JsonValidator} from "../util/jsonValidator"

export enum DistanceUnits {
    meters = "meters",
    kilometers = "kilometers",
    miles = "miles",
}

export interface GeoJsonRequest {
    readonly location: [lng: number, lat: number],
    readonly distance: number,
    readonly unit?: DistanceUnits
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GeoJsonRequest {
    export function validate(target: unknown): asserts target is  GeoJsonRequest {
        JsonValidator.validate(target, schema)
    }

    const schema = {
        type: 'object',
        required: ['location', 'distance'],
        properties: {
            location: {
                type: 'array',
                prefixItems: [{type: "number"}, {type: "number"}],
                minItems: 2,
                maxItems: 2,
            },
            distance: {
                type: 'integer',
                minimum: 0
            },
            unit: {
                type: 'string',
                enum: ['meters', 'kilometers', 'miles']
            }
        },
        additionalProperties: false
    }
}