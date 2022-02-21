/* eslint-disable react/display-name */
import React, { useState,useRef} from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { Photo } from '../lib/types';
import Stack from '@mui/material/Stack';
import {PhotoView}  from '../components/PhotoView/PhotoView'; 
import Filter  from '../components/Filter/Filter'; 

export default function Home({ locatedPhotos,  minYear,  maxYear,title}: {
      locatedPhotos: Photo[],
      minYear: number,
      maxYear: number,
      title: String 
  }){

  const [allPhotos, setAllPhotos] = useState(locatedPhotos);
  const [selectedPhotos, setSelectedPhotos] = useState(locatedPhotos)
  const Map = React.memo(dynamic(
    () => import('../components/Map/Map'), 
    { 
      loading: () => <p>Map is loading.</p>,
      ssr: false  
    } 
  ));

  const [photoViewController,setPhotoViewController] = useState(Object())
  return (
    <div className={styles.container}>
      <Head>
          <title>Mapping Margolies</title>
          <meta name="description" content="Mapping the images of photographer John Margolies" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
          <h1>John Margolies Photo Map</h1>
          <div dangerouslySetInnerHTML={{ __html: title }}></div>

          <Filter  
              setSelectedPhotos={setSelectedPhotos} 
              allPhotos={allPhotos} 
              maxYear={maxYear} 
              minYear={minYear}>
          </Filter>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <Map photoViewController={photoViewController} photos={selectedPhotos} />
              <PhotoView photoViewController={photoViewController} ></PhotoView>
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
  
  const res = await fetch(process.env.REQUEST_URL!,
  {
    headers: {'Authorization': 'Token: ' + process.env.TOKEN}
  })
  const data = await res.json();
  let title  ="";
   
  for (let i = 0;i< data.length;i++){
    if(data[i].title="Intro"){
      title = (data[i].published);
      break;
    }
  }

  return {
    props: {
      locatedPhotos,
      minYear,
      maxYear,
      title,
    }
  }
}

 