/* eslint-disable react/display-name */
import React, { useState } from 'react';
import styles from '../../styles/Home.module.css';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

export default function YearFilter(props: any){
    const [yearStart, setYearStart] = useState(props.minYear)
    const [yearEnd, setYearEnd] = useState(props.maxYear)
    const [value, setValue] = React.useState< number[]>([yearStart, yearEnd]);
    const handleChange = (event: Event, value:  any) => {
      setValue(value);
    };

    function filterFunction(p: { min_year: number; max_year: number; id: number; }){
       //Used an array to get all the id associated with the chosen keywords 
      let id_array: String[] = []
      for(let i = 0; i < props.selectedKeywords.length; i ++){
        id_array = id_array.concat(props.keywordsObject[props.selectedKeywords[i]])

      }
      //We don't have to use keywords to filter if there are no keywords chosen
      if (id_array.length === 0) {
          return (p.min_year >= value[0] && p.max_year <= value[1])
      }
      //We filter those photo whose id is included in those ids associated with the chosen keywords
      let included = false
       for (let i = 0; i < id_array.length; i++){
          if(String(p.id) ==id_array[i] ){
            included = true
          break;
          }
          
       }
       
       return (p.min_year >= value[0] && p.max_year <= value[1]) && included == true
    }
    return (
      <div className={styles.controls}>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <div> Min: {props.minYear} </div>
            <Slider
              sx={{
                width: 850,
                color: 'success.main',
              }}    
              min= {props.minYear}
              max= {props.maxYear}
              getAriaLabel={() => 'Years range'}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="on"
            />
          <div> Max: {props.maxYear} </div>
          <button onClick={() => {
            let filteringResult = props.allPhotos.filter(filterFunction)
            if(filteringResult.length ==0){
                  alert("No photos match the given search criteria")
            
            }
            props.setSelectedPhotos(filteringResult);
            setYearStart(value[0]);
            setYearEnd(value[1]);
          }}>Filter</button>
        </Stack>
        
    </div>
    )
  }