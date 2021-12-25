import React, { FC, useCallback } from 'react';
import { $enum } from 'ts-enum-util';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Color } from '@/types/Color';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

interface IProps {
    label: string;
    value: Color;
    onChange: (value: Color) => void;
}

export const PositionColor: FC<IProps> = ({ label, value, onChange }: IProps) => {
    const handleChange = useCallback(
        (event: SelectChangeEvent<Color>) => {
            onChange(event.target.value as Color);
        },
        [onChange]
    );
    return (
        <FormControl fullWidth>
            <InputLabel
                id="type-color-label"
                style={{
                    backgroundColor: Object.keys(Color)[Object.values(Color).indexOf(value)],
                    color: Color.BLACK === value ? '#495057' : 'black',
                    padding: '0 5px'
                }}
            >
                {label}
            </InputLabel>
            <Select<Color> labelId="type-color-label" value={value} label={label} onChange={handleChange}>
                {$enum(Color).map((val, key) => (
                    <MenuItem
                        key={key}
                        value={val}
                        style={{ backgroundColor: key, color: Color.BLACK === val ? '#495057' : 'black' }}
                    >
                        {key}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
