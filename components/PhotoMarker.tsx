import { LatLngTuple } from 'leaflet';
import { FC } from 'react';
import { Marker, Popup } from "react-leaflet";
import Image from 'next/image';
import { Photo } from '../lib/types';
import { IMG_URL_BASE } from '../lib/util';

interface PMProps {
    photo: Photo
}

const PhotoMarker: FC<PMProps> = ({photo}) => {
    const img_url: string = IMG_URL_BASE + photo.id + '.jpg';
    const credit = photo.credit.replace('Credit line: ', '');
    const year = photo.min_year === photo.max_year ? photo.min_year.toString() : `${photo.min_year} - ${photo.max_year}`
    return (
        <Marker position={[photo.latitude, photo.longitude]}>
            <Popup>
                <div style={{maxWidth: 200}}>
                    <h3>{photo.title}</h3>
                    <Image 
                        src={img_url} 
                        width={200}
                        height={200}
                        alt={photo.title}
                        title={photo.title}

                    />
                    <p>{year}</p>
                    <p style={{fontWeight:'lighter', fontSize:'smaller'}}>
                        Credit: {credit}
                    </p>
                </div>
            </Popup>
            
        </Marker>
    )
}
export default PhotoMarker;
