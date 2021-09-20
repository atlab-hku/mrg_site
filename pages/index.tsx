/* eslint-disable react/display-name */
import React, { useEffect, useState,useRef, useImperativeHandle, forwardRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { Photo } from '../lib/types';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
const STATIC_URL = 'https://d2sgv5kjr4yd0f.cloudfront.net';
export default function Home(
  { locatedPhotos,  minYear,  maxYear}: {
    locatedPhotos: Photo[],
    minYear: number,
    maxYear: number
  }
  ) {
     
   
  const [allPhotos, setAllPhotos] = useState(locatedPhotos);
  const [selectedPhotos, setSelectedPhotos] = useState(locatedPhotos)
  const [yearStart, setYearStart] = useState(minYear)
  const [yearEnd, setYearEnd] = useState(maxYear)
    
  const Map = React.memo(dynamic(
    () => import('../components/Map'), 
    { 
      loading: () => <p>Map is loading.</p>,
      ssr: false  
    } 
  ));
  
  function YearFilter(){
    const [value, setValue] = React.useState([yearStart, yearEnd]);
    const handleChange = (event: any, newValue: React.SetStateAction<number[]>) => {
      setValue(newValue);
    };
    return (
      <div className={styles.controls}>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <div> Min: {minYear} </div>
            <Slider
              sx={{
                width: 850,
                color: 'success.main',
              }}    
              min= {minYear}
              max= {maxYear}
              getAriaLabel={() => 'Years range'}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="on"
            />
          <div> Max: {maxYear} </div>
          <button onClick={() => {
            setSelectedPhotos(allPhotos.filter((p: { min_year: number; max_year: number; }) => (p.min_year >= value[0] && p.max_year <= value[1])));
            setYearStart(value[0]);
            setYearEnd(value[1]);
          }}>Filter</button>
        </Stack>
    </div>
    )
  }

  const PhotoView = forwardRef((props, ref) => {

    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    const [innerHtml, setInnerHtml] = useState( <div style={{maxWidth: 300}}>
      <h3>Click on a marker to view the photo at that location</h3>
       
  </div>)
    useImperativeHandle(ref, () => ({
      setPhotoInfo(value) {
        setInnerHtml(value)
      }
    }));
    return(
      innerHtml
     
    )
  });
  
  const photoViewRef = useRef();
 
 
  return (
    <div className={styles.container}>
      <Head>
        <title>Mapping Margolies</title>
        <meta name="description" content="Mapping the images of photographer John Margolies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>John Margolies Photo Map</h1>
        <p>
          The photographs below were taken by photographer John Margolies between {minYear} and {maxYear}
        </p>
       <YearFilter></YearFilter>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <Map  photoViewRef={photoViewRef} photos={selectedPhotos} />
      <PhotoView ref={photoViewRef}></PhotoView>
         </Stack>
      </main>

      <footer className={styles.footer}>
        ©️ 2021 <a href="https://kotsf.com">Kotsf Limited</a> and <a href="https://msteinberg.art">Monica Steinberg</a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const photos: Photo[] = require('../data/photos.json');
  const locatedPhotos: Photo[] =  photos.filter((p: Photo) => p.latitude !== null && p.longitude !== null);
  const minYear: number = Math.min(...locatedPhotos.map((p: Photo) => p.min_year));
  const maxYear: number = Math.max(...locatedPhotos.map((p: Photo) => p.max_year));
  return {
    props: {
      locatedPhotos,
      minYear,
      maxYear,
    }
  }
}