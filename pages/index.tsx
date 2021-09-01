/* eslint-disable react/display-name */
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { Photo } from '../lib/types';
import DoubleSlider from '../components/DoubleSlider';

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

  const Map = React.memo(dynamic(
    () => import('../components/Map'), 
    { 
      loading: () => <p>Map is loading.</p>,
      ssr: false  
    } 
  ));
  
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
        <div className={styles.controls}>
          <h2>Adjust the values below to filter the photos shown on the map</h2>
          <label htmlFor="fromYear">From Year</label>
          <input 
            type="number" 
            value={fromYear} 
            size={6}
            name="fromYear" onChange={(e) => (setFromYear(parseInt(e.target.value)))} />
          <label htmlFor="toYear">To Year</label>
          <input 
            type="number" 
            value={toYear} 
            name="toYear" 
            size={6}
            onChange={(e) => (setToYear(parseInt(e.target.value)))} />
          <button onClick={() => setSelectedPhotos(allPhotos.filter(p => (p.min_year >= fromYear && p.max_year <= toYear)))}>Filter</button>
        </div>
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