import { LatLngTuple } from 'leaflet';
import { FC, useState } from 'react';
import { CircleMarker, Popup } from "react-leaflet";
import Image from 'next/image';
import { Photo } from '../lib/types';
import { IMG_URL_BASE } from '../lib/util';

interface PMProps {
    photo: Photo,
    getLocation: any,
 
}

const PhotoMarker: FC<PMProps> = ({photo,getLocation }) => {
    const img_url: string = IMG_URL_BASE + photo.id + '.jpg';
    const year = photo.min_year === photo.max_year ? photo.min_year.toString() : `${photo.min_year} - ${photo.max_year}`;
    const popupWidth: number = 300;

     
    let offset = [0,0];
    const[notused , forceRerender] = useState("");
      return (
        <CircleMarker  center={[photo.latitude, photo.longitude]}
        eventHandlers={{
            click: (e) => {
                //Get current pixel location.
                let currentLocation = (getLocation([photo.latitude, photo.longitude]));
                offset[0] = 180 - currentLocation[0] ;
                offset[1] = 600 - currentLocation[1] ;               
                forceRerender(Date());
                //This is used to initate a state change to force rerendering when the marker is clicked, so that the
                //computation of the appropriate offset value will be set to the Popup
                
            },
          }}
        >
            
            <Popup  offset={offset} autoPan={false}    >
        
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
