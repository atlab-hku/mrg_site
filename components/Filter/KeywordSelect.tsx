/* eslint-disable react/display-name */
import React, { useState,useRef, useImperativeHandle, forwardRef } from 'react';
import styles from '../../styles/Home.module.css';

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

 export default function KeywordsSelect(props: any) {
      
    return (
      <Autocomplete
      className={styles.controls}
        multiple
        id="checkboxes-tags-demo"
        options={props.keywords}
        disableCloseOnSelect
        onChange={(event, newValue) => {
            props.changeSelectedKeywords(newValue)
        }}
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
  