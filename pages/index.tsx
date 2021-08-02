/* eslint-disable react/display-name */
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { Photo } from '../lib/types';

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
  const [fromYear, setFromYear] = useState(minYear);
  const [toYear, setToYear] = useState(maxYear);

  const Map = dynamic(
    () => import('../components/Map'), 
    { 
      loading: () => <p>Map is loading.</p>,
      ssr: false  
    } 
  )
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Mapping Margolies</title>
        <meta name="description" content="Mapping the images of photographer John Margolies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Map photos={selectedPhotos} />
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