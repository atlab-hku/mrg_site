import { LatLngTuple } from 'leaflet';
import { FC, useState } from 'react';
import { CircleMarker, Popup } from "react-leaflet";
import Image from 'next/image';
import { Photo } from '../lib/types';
import { IMG_URL_BASE } from '../lib/util';

interface PMProps {
    photo: Photo,
    markerLanlngToPixel: any
}

const PhotoMarker: FC<PMProps> = ({photo,markerLanlngToPixel}) => {
    const img_url: string = IMG_URL_BASE + photo.id + '.jpg';
    const year = photo.min_year === photo.max_year ? photo.min_year.toString() : `${photo.min_year} - ${photo.max_year}`
    const popupWidth: number = 300;
     //We must update it whenever we zoom
    function Fire(){
        setPixellocation(markerLanlngToPixel([photo.latitude, photo.longitude]));
        return null;
    }
    const [pixelLocation, setPixellocation] = useState(markerLanlngToPixel([photo.latitude, photo.longitude]));
    return (
        <CircleMarker  center={[photo.latitude, photo.longitude]}
        eventHandlers={{
            click: (e) => {
                setPixellocation(markerLanlngToPixel([photo.latitude, photo.longitude]))
            },
          }}
        >
            
            <Popup   offset={[400-pixelLocation.x,600 - pixelLocation.y]}  autoPan={false} >
        
                <div style={{maxWidth: popupWidth}}>
                    <h3>{photo.title}</h3>
                    <a href={img_url} target="_blank">
                        <Image 
                            src={img_url} 
                            width={popupWidth}
                            height={300}
                            alt={photo.title}
                            title={photo.title}
                            objectFit="scale-down"

                        />
                    </a>
                    <p>{year}</p>
                    <p style={{fontWeight:'lighter', fontSize:'smaller'}}>
                        Credit: {photo.credit}
                    </p>
                </div>
            </Popup>
            
        </CircleMarker>
    )
}
export default PhotoMarker;
