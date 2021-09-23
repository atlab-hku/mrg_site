/* eslint-disable react/display-name */
import React, { useState , useImperativeHandle, forwardRef, useEffect } from 'react';
 
export const PhotoView = forwardRef((props, ref) => {

    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    const [innerHtml, setInnerHtml] = useState( <h3>Click on a marker to view the photo at that location</h3>)
 
    useImperativeHandle(ref, () => ({
      setPhotoInfo(value: any) {
        setInnerHtml(value)
        console.log(Date())
       }
    }));
    return(
      <div style={{maxWidth: 300}}>
         {innerHtml}
     </div>
     
    )
});
  