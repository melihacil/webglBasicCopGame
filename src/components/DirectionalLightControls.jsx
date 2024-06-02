import React, { useState } from 'react';
import { Slider, Box as MuiBox, Typography } from '@mui/material';

export default function LightControl({ lightRef }) {
    const [intensity, setIntensity] = useState(0.4);
    const [position, setPosition] = useState([-10, 10, 0]);

    const handleIntensityChange = (event, newValue) => {
        setIntensity(newValue);
        if (lightRef.current) {
            lightRef.current.intensity = newValue;
        }
    };

    const handlePositionChange = (axis, newValue) => {
        const newPos = [...position];
        newPos[axis] = newValue;
        setPosition(newPos);
        if (lightRef.current) {
            lightRef.current.position.set(...newPos);
        }
    };

    return (
        <MuiBox sx={{ position: 'absolute', top: 20, left: 20, zIndex: 1, backgroundColor: 'white', padding: 2, borderRadius: 1 }}>
            <Typography variant="h6">Light Control</Typography>
            <Typography variant="body1">Intensity</Typography>
            <Slider value={intensity} onChange={handleIntensityChange} min={0} max={2} step={0.1} />
            <Typography variant="body1">Position X</Typography>
            <Slider value={position[0]} onChange={(e, val) => handlePositionChange(0, val)} min={-20} max={20} step={0.1} />
            <Typography variant="body1">Position Y</Typography>
            <Slider value={position[1]} onChange={(e, val) => handlePositionChange(1, val)} min={-20} max={20} step={0.1} />
            <Typography variant="body1">Position Z</Typography>
            <Slider value={position[2]} onChange={(e, val) => handlePositionChange(2, val)} min={-20} max={20} step={0.1} />
        </MuiBox>
    );
}
