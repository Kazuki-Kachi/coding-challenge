// eslint-disable-next-line @typescript-eslint/no-namespace
import atlas, {AuthenticationType}                  from "azure-maps-control"
import {fromEventPattern, map, merge, throttleTime} from "rxjs"

let source: atlas.source.DataSource, bubbleLayer: atlas.layer.BubbleLayer

export function getMap() {
    //Initialize a map instance.
    const atlasMap = new atlas.Map('myMap', {
        center: [-122.43155604282938, 37.76016570672468],
        zoom: 11,
        style: 'grayscale_dark',
        view: 'Auto',
        authOptions: {
            authType: AuthenticationType.subscriptionKey,
            subscriptionKey: process.env.MapKey
        }
    })

    merge(fromEventPattern(addHandler => atlasMap.events.add('ready', addHandler), handler => atlasMap.events.remove('ready', handler)),
        fromEventPattern(addHandler => atlasMap.events.add('moveend', addHandler), handler => atlasMap.events.remove('moveend', handler))).pipe(
        throttleTime(100),
        map((_, index) => index)
    ).subscribe(index => {
        if (!index) atlasMap.imageSprite.add('fire-shield-icon', '/images/icons/fire_shield.png')
        const [longitude, latitude] = atlasMap.getCamera().center ?? [0, 0]
        fetch(`http://localhost:7071/api/foodTrucks?location=${latitude}&location=${longitude}&distance=10`).then(response => response.json()).then(results => {
            const pins = results.features
            atlasMap.sources.clear()
            if(bubbleLayer) atlasMap.layers.remove(bubbleLayer)
            source ??= new atlas.source.DataSource()
            source.clear()
            source.add(pins)
            bubbleLayer = new atlas.layer.BubbleLayer(source, undefined, {
                radius: 4,
                strokeWidth: 0
            })

            atlasMap.layers.add([bubbleLayer], 'labels')

        })
    })

}