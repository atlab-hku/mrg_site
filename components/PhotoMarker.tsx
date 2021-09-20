import { LatLngTuple } from 'leaflet';
import { FC, useState, useEffect } from 'react';
import { CircleMarker, Popup } from "react-leaflet";
import Image from 'next/image';
import { Photo } from '../lib/types';
import { IMG_URL_BASE } from '../lib/util';
 interface PMProps {
    photo: Photo,
    photoViewRef: any,
    markerController: any,
    photos: any
}

const PhotoMarker: FC<PMProps> = ({photo,photoViewRef,markerController,photos }) => {
    const img_url: string = IMG_URL_BASE + photo.id + '.jpg';
    const year = photo.min_year === photo.max_year ? photo.min_year.toString() : `${photo.min_year} - ${photo.max_year}`;
    const popupWidth: number = 300;
    const [color, setColor] = useState('#3388ff')
    const [fillColor, setFillColor] = useState('#3388ff')
    const [fillOpacity, setFillOpacity] = useState(0.2)
    let photosWithSameLanLng: any = []
    useEffect(() => {
        for(let i = 0; i < photos.length; i++){
            if(photos[i].latitude == photo.latitude && photos[i].longitude == photo.longitude ){
                photosWithSameLanLng.push(photos[i])
            }
        }
        }, []) 
    function resetColor(){
        setColor('#3388ff');
        setFillColor('#3388ff');
        setFillOpacity(0.2);
    }
        let as = [ 1,2,3,4,5,6,7,8,9,10]
        let temp = as.map(()=>(<h1>asd</h1>))
       return (
        <CircleMarker  
    
        pathOptions={{ color: color, fillColor: fillColor, fillOpacity: fillOpacity }} 
             center={[photo.latitude, photo.longitude]}
             
            eventHandlers={{
                click: (e) => {
                  
                   
                    setColor("#FF00FF");
                    setFillColor("#FF00FF")
                    setFillOpacity("0.8")
                    markerController.changeLastMarkerColorToDefault();
                    markerController.changeLastMarkerColorToDefault = resetColor
                    
                      let photoInfoHtml = 
                    (
                        <div style={{maxWidth: popupWidth}}>
                            <h3>{photo.title}: {color}</h3>
                            <a href={img_url} target="_blank" rel="noreferrer">
                                <Image 
                                    key={img_url}
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
                    );
                    photoViewRef.current.setPhotoInfo(photoInfoHtml)
    
            },
          }}
        >
            <Popup autoPan={false}>
             <div style={{width: 120, height: 200, overflowY: "scroll"
    }}>
                 {temp}
             </div>
            </Popup>
            
            
        </CircleMarker>
    )
}
export default PhotoMarker;
