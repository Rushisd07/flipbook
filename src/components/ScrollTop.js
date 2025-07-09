"use client";
import { useScrollTrigger, Zoom, Fab } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

export default function ScrollTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        id="back-to-top-anchor"
        onClick={handleClick}
        // color="primary"
        // size="small"
        aria-label="scroll back to top"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
}
