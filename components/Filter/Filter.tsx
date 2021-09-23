import {useState} from 'react';
import YearFilter  from './YearFilter'; 
import KeywordsSelect  from './KeywordSelect'; 
let keywordsObject = require('../../data/keywords.json');

export default function Filter(props: any){
        const [selectedKeywords, changeSelectedKeywords] = useState([])
        return (<>
            <YearFilter keywordsObject={keywordsObject} setYearEnd={props.setYearEnd }setYearStart={props.setYearStart} setSelectedPhotos={props.setSelectedPhotos} allPhotos={props.allPhotos} maxYear={props.maxYear} minYear={props.minYear} yearEnd={props.yearEnd} yearStart={props.yearStart} selectedKeywords={selectedKeywords}></YearFilter>
            <KeywordsSelect  keywordsObject={keywordsObject} changeSelectedKeywords={changeSelectedKeywords}></KeywordsSelect>
           </>
        )
}