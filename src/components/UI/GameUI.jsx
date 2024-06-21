import React, { useState } from "react";
import { Slider, Box as MuiBox, Typography, Checkbox, Button } from "@mui/material";



export default function GameUI({ score, setIsPlaying }) {
  return (
    <MuiBox
      sx={{
        position: "fixed", // Ensures the box stays in place
        top: 0,
        left: "50%", // Move the box horizontally to the center
        transform: "translate(-50%, 0)", // Adjust the horizontal offset
        width: "40%", // Stretches horizontally
        height: "50px", // Adjust height as needed
        backgroundColor: "white",
        padding: 2,
        borderRadius: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <Typography variant="h6" style={{ fontSize: '12px', wordWrap: "break-word" }}>
        CENG 492 Project 201180077-191180049 <br />

        {/* <Typography variant="body1">Intensity</Typography> */}
        <Button
          variant="outlined"

          onClick={() => {
            //alert('clicked');
            setIsPlaying(true);
          }}
          color="success"
          size="medium"
          style={{ fontSize: '18px' }}
        >
          --PLAY!--
        </Button>
        <Button
          variant="outlined"
          color="success"
          size="medium"
          style={{ fontSize: '18px' }}
        >
          Score:{score}

        </Button>
      </Typography>


    </MuiBox>
  );
}
