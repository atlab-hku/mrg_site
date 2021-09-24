/* eslint-disable react/display-name */
import React, { useState , useImperativeHandle, forwardRef, useEffect } from 'react';
 
export function PhotoView (props: any) {
    const [innerHtml, setInnerHtml] = useState( <h3>Click on a marker to view the photo at that location</h3>)
    
    useEffect(()=>{
      props.photoViewController.setPhotoInfo = setInnerHtml
    },[props.photoViewController])

    return(
      <div style={{maxWidth: 300}}>
         {innerHtml}
     </div>
     
    )
}
  