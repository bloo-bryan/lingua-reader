import {InputLabel, NativeSelect} from "@mui/material";
import * as React from "react";

const CustomNativeSelect = ({labelText, name, value, handleChange, list}) => {
    return (
        <div className='form-row'>
            <InputLabel variant="standard" htmlFor={name} className='form-label'>
                {labelText || name}
            </InputLabel>
            <NativeSelect name={name} value={value} id={name} onChange={handleChange} className='form-select'>
                {list.map((item, index) => {
                    return <option key={index} value={item}>{item}</option>
                })}
            </NativeSelect>
        </div>

    )
}

export default CustomNativeSelect;