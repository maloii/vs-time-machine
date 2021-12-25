import React, { FC, useCallback } from 'react';
import { Channel, ChannelFrequencies } from '@/types/VTXChannel';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { $enum } from 'ts-enum-util';

interface IProps {
    label: string;
    value: Channel;
    onChange: (value: Channel) => void;
}

export const PositionChannel: FC<IProps> = ({ label, value, onChange }: IProps) => {
    const handleChange = useCallback(
        (event: SelectChangeEvent<Channel>) => {
            onChange(event.target.value as Channel);
        },
        [onChange]
    );
    return (
        <FormControl fullWidth>
            <InputLabel id="type-color-label">{label}</InputLabel>
            <Select<Channel> labelId="type-color-label" value={value} label={label} onChange={handleChange}>
                {$enum(Channel).map((val, key) => (
                    <MenuItem key={key} value={val}>
                        {`${key} ${ChannelFrequencies[key]}`}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
