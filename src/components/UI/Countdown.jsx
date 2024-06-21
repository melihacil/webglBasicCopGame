import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function CountdownTimer({ isPlaying, setIsPlaying }) {
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        let timerId;

        if (isPlaying && timeLeft > 0) {
            timerId = setTimeout(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft <= 0) {
            setTimeLeft(60);
            setIsPlaying(false);
        }

        return () => clearTimeout(timerId);
    }, [isPlaying, timeLeft, setIsPlaying]);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                padding: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                borderRadius: 1,
                zIndex: 1000
            }}
        >
            <Typography variant="h6">
                {timeLeft} seconds remaining
            </Typography>
        </Box>
    );
}

export default CountdownTimer;
