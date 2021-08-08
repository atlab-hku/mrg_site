import React, {useState, useEffect, FC} from 'react';

interface DSProps {
    min: number,
    max: number
}
const thumbSize = 14;

const DoubleSlider: FC<DSProps> = ({min, max}) => {

    const [avg, setAvg] = useState((min+max)/2);
    const [minVal, setMinVal] = useState(avg);
    const [maxVal, setMaxVal] = useState(avg);

    const width = 300;
    const minWidth = thumbSize + ((avg - min) / (max-min)) * (width - 2 * thumbSize);
    const minPercent = ((minVal - min) / (avg-min)) * 100;
    const maxPercent = ((maxVal - avg) / (max-avg)) * 100;
    const styles = {
        min: {
            width: minWidth,
            left: 0,
            "--minRangePercent": `${minPercent}%`
        },
        max: {
            width: thumbSize + ((max - avg) / (max - min)) * (width - 2 * thumbSize),
            left: minWidth,
            "--maxRangePercent": `${maxPercent}%`
        }
    };

    useEffect(() => {
        setAvg((maxVal + minVal) / 2);
    }, [minVal, maxVal]);
    return (
        <div 
            className="min-max-slider"
            data-legendnum="2"
            data-rangemin={min}
            data-rangemax={max}
            data-thumbsize={thumbSize}
            data-rangewidth={width}
        >
            <label htmlFor="min">From year</label>
            <input
                id="min"
                className="min"
                style={styles.min}
                name="min"
                type="range"
                step="1"
                min={min}
                max={avg}
                value={minVal}
                onChange={({ target }) => setMinVal(Number(target.value))}
            />
            <label htmlFor="max">To year</label>
            <input
                id="max"
                className="max"
                style={styles.max}
                name="max"
                type="range"
                step="1"
                min={avg}
                max={max}
                value={maxVal}
                onChange={({ target }) => setMaxVal(Number(target.value))}
            />
        </div>

    )
}

export default DoubleSlider;