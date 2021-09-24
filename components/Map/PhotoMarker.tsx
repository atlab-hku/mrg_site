import { FC, useState} from 'react';
import Button from '@mui/material/Button';
import { CircleMarker, Popup } from "react-leaflet";
import Image from 'next/image';
import { Photo, MarkerController } from '../../lib/types';
import { IMG_URL_BASE } from '../../lib/util';

interface PMProps {
    photo: Photo,
    markerController: MarkerController,
    photos: Photo[],
    photoViewController: any
}

function createInfoHtml(photo: Photo){
    const img_url: string = IMG_URL_BASE + photo.id + '.jpg';
    const year = photo.min_year === photo.max_year ? photo.min_year.toString() : `${photo.min_year} - ${photo.max_year}`;
   
    let photoInfoHtml = 
    (         
            <>
                <h3>{photo.title}</h3>
                <a href={img_url} >
                    <Image
                    priority={true }
                    loading="eager"
                    key={img_url}
                    src={img_url}
                    width={300}
                    height={300}
                    alt={photo.title}
                    title={photo.title}
                    objectFit="scale-down" />
               
                </a>
                <p> {year} </p>
                <p style={{ fontWeight: 'lighter', fontSize: 'smaller' }}>
                    Credit: {photo.credit}
                </p>
            </>
     );
    return photoInfoHtml;
}
function getPhotosWithSameLanLng(photos:  Photo[], photo: Photo): Photo[]{
    let photosWithSameLanLng:  Photo[] = []
    for(let i = 0; i < photos.length; i++){
        if(photos[i].latitude == photo.latitude && photos[i].longitude == photo.longitude ){
            photosWithSameLanLng.push(photos[i])
        }
    }
   let sortedPhotos =  photosWithSameLanLng.sort( (a: Photo,b: Photo) => Number(a.min_year - b.min_year))
   return sortedPhotos
}
 
const PhotoMarker: FC<PMProps> = ({photo,markerController,photos, photoViewController }) => {

    const [color, setColor] = useState('#3388ff')
    const [fillColor, setFillColor] = useState('#3388ff')
    const [fillOpacity, setFillOpacity] = useState(0.2)
    const [similarPhotosSelectHTML, setSimilarPhotosSelectHTML] = useState<any | null>(<div></div>);
    function resetColor(){
        setColor('#3388ff');
        setFillColor('#3388ff');
        setFillOpacity(0.2);
    }
    return (
        <CircleMarker  
            pathOptions={{ color: color, fillColor: fillColor, fillOpacity: fillOpacity }} 
            center={[photo.latitude, photo.longitude]} 
            eventHandlers={{
                click: (e) => {
                    let photoList: any[]  = 
                        getPhotosWithSameLanLng(photos,photo).map(
                            (p: Photo, index: number) => 
                            (<div key={p.id}>
                                <Button  
                                    style={{textTransform: 'none'}} 
                                    size="small" 
                                    variant="outlined" 
                                    onClick={()=>{
                                        photoViewController.setPhotoInfo(createInfoHtml(p))
    
                                    }}
                                >
                                    {index+1}. {p.title}{
                                    "\n"} 
                                    {p.min_year === p.max_year ? p.min_year.toString() : `${p.min_year} - ${p.max_year}`}
                                </Button>
                            </div>))
                    setSimilarPhotosSelectHTML(photoList)
                    setColor("#FF00FF");
                    setFillColor("#FF00FF")
                    setFillOpacity(0.2)
                    markerController.changeLastMarkerColorToDefault();
                    markerController.changeLastMarkerColorToDefault = resetColor
                    photoViewController.setPhotoInfo(createInfoHtml(photo))
                },
            }}
        >
            <Popup autoPan={false}>
                <div style={{width: 200, height: 100, overflowY: "scroll" }}>   
                    {similarPhotosSelectHTML}
                </div>
            </Popup>   
        </CircleMarker>
    )
}
export default PhotoMarker;
