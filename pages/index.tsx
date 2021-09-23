/* eslint-disable react/display-name */
import React, { useState,useRef, useImperativeHandle, forwardRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { Photo } from '../lib/types';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import  KeywordsSelect  from '../components/Filter/KeywordSelect'; 
import  {PhotoView}  from '../components/PhotoView'; 
 
import  Filter  from '../components/Filter/Filter'; 

 

export default function Home({ locatedPhotos,  minYear,  maxYear}: {
      locatedPhotos: Photo[],
      minYear: number,
      maxYear: number
  }){
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
       
       <Filter  setYearEnd={setYearEnd }setYearStart={setYearStart} setSelectedPhotos={setSelectedPhotos} allPhotos={allPhotos} maxYear={maxYear} minYear={minYear} yearEnd={yearEnd} yearStart={yearStart} ></Filter>
 

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