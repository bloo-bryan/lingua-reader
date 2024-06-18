import {Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import {useTheme} from "@mui/material/styles";
import englishPOS from "../utils/englishPOS";

const ITEM_HEIGHT = 54;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, pos, theme) {
    return {
        fontWeight:
            pos.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const ChipSelector = ({pos, func}) => {
    const theme = useTheme();

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        func(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    return (
        <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="demo-multiple-chip-label">POS</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={pos}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {englishPOS.map((name) => (
                    <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, pos, theme)}
                    >
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default ChipSelector;