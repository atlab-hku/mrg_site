import { LatLngTuple } from 'leaflet';
import { FC } from 'react';
import { CircleMarker, Popup } from "react-leaflet";
import Image from 'next/image';
import { Photo } from '../lib/types';
import { IMG_URL_BASE } from '../lib/util';

interface PMProps {
    photo: Photo
}

const PhotoMarker: FC<PMProps> = ({photo}) => {
    const img_url: string = IMG_URL_BASE + photo.id + '.jpg';
    const year = photo.min_year === photo.max_year ? photo.min_year.toString() : `${photo.min_year} - ${photo.max_year}`
    const popupWidth: number = 300;
    return (
        <CircleMarker center={[photo.latitude, photo.longitude]}>
            <Popup>
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
