import { FC, useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { LatLngTuple } from 'leaflet';
import  { Photo  } from '../../lib/types';
import PhotoMarker from './PhotoMarker';

interface MapProps {
    photos: Photo[],
    photoViewRef: any
    
}

const Map: FC<MapProps> = ({ photos ,photoViewRef }) => {
    const startPosition : LatLngTuple = [37.09024, -95.712891];
    const [markerController, setMarkerController] = useState(Object())
    const [markers, setMarkers] = useState(useMemo(

    //Trying to use usestate and useeffect to only compute the values on the inital render. 
        () => photos.map(
                (p: Photo) => 
                (<PhotoMarker 
                    markerController={markerController} 
                    photos={photos}  
                    photoViewRef={photoViewRef}  
                    key={p.id} 
                    photo={p} />
                )
            ),
            [markerController, photoViewRef, photos]
        ))
    useEffect(() => {
        markerController.changeLastMarkerColorToDefault = function(){
            //A dummy function. Later it will be replaced by another marker's own function for reverting its' own color
        }
      }, [markerController]);

     return (
        <MapContainer center={startPosition} zoom={4} scrollWheelZoom={true} 
                    style={{height:600, width:800, borderRadius:"2em"}}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
             {markers}
        </MapContainer>
    )
}

export default Map
