import React, { FC, useState } from "react";
import { Photo } from "../lib/types";

interface MapHolderProps {
    photos: Photo[]
}

const MapHolder : FC<MapHolderProps> = ({photos, children}) => {

    return (
        <>
            {children}
        </>
    )
}

export default MapHolder;