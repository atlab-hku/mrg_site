/* eslint-disable react/display-name */
import React, { useEffect, useState,useRef, useImperativeHandle, forwardRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { Photo } from '../lib/types';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

let keywordsObject = require('../data/keywords.json');
const keywords = Object.keys(keywordsObject);
let selectedKeywords: string | any[] = []

function CheckboxesTags() {
  return (
    <Autocomplete
    className={styles.controls}
      multiple
      id="checkboxes-tags-demo"
      options={keywords}
      disableCloseOnSelect
      onChange={(event, newValue) => {
        selectedKeywords = newValue
      }}
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      style={{ width: 1100 }}
      renderInput={(params) => (
        <TextField {...params} label="Keywords" placeholder="Keywords" />
      )}
    />
  );
}


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

    function filterFunction(p: { min_year: number; max_year: number; id: any; }){
       //Used an array to get all the id associated with the chosen keywords 
      let id_array: any[] = []
      for(let i = 0; i < selectedKeywords.length; i ++){
        id_array = id_array.concat(keywordsObject[selectedKeywords[i]])

      }
      //We don't have to use keywords to filter if there are no keywords chosen
      if (id_array.length === 0) {
          return (p.min_year >= value[0] && p.max_year <= value[1])
      }
      //We filter those photo whose id is included in those ids associated with the chosen keywords
      let included = false
       for (let i = 0; i < id_array.length; i++){
          if(p.id ==id_array[i] ){
            included = true
          break;
          }
          
       }
       
       return (p.min_year >= value[0] && p.max_year <= value[1]) && included == true
    }
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
            let filteringResult = allPhotos.filter(filterFunction)
            if(filteringResult.length ==0){
                  alert("No photos match the given search criteria")
                 
            
            }
            setSelectedPhotos(filteringResult);
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
    const [innerHtml, setInnerHtml] = useState( <h3>Click on a marker to view the photo at that location</h3>)
     useImperativeHandle(ref, () => ({
      setPhotoInfo(value) {
        
        setInnerHtml(value)
       }
    }));
    return(
      <div style={{maxWidth: 300}}>
     
      {innerHtml}
       
     </div>
     
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
 <CheckboxesTags></CheckboxesTags>

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