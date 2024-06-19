import React, { useState } from "react";
import { Slider, Box as MuiBox, Typography, Checkbox } from "@mui/material";

export default function GameUI({ lightRef, ambientRef }) {
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
      <Typography variant="h6">CENG 492 Project 201180077 191180049</Typography>
      <Typography variant="body1">Intensity</Typography>
      <Slider
        value={1}
        min={0}
        max={2}
        step={0.1}
      />
      <Checkbox />
    </MuiBox>
  );
}
