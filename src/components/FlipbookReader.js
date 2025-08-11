"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Dialog,
  Slide,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Refresh,
  Fullscreen,
  Close,
  Book,
} from "@mui/icons-material";
import "./FlipbookGenerator.css"; // Reuse the same CSS

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FlipbookReader({ data, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pagesContainerRef = useRef(null);

  useEffect(() => {
    // Generate the flipbook when data is loaded
    if (data && data.pages && pagesContainerRef.current) {
      generateFlipbookFromData();
    }
  }, [data]);

  const generateFlipbookFromData = () => {
    const pagesContainer = pagesContainerRef.current;
    if (!pagesContainer) return;

    pagesContainer.innerHTML = "";

    data.pages.forEach((pageData, index) => {
      const pageDiv = document.createElement("div");
      pageDiv.className = "page";

      const img = document.createElement("img");
      img.src = pageData.imageData;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.draggable = false;

      pageDiv.appendChild(img);
      pagesContainer.appendChild(pageDiv);
    });

    setupPages();
  };

  const setupPages = () => {
    const pages = pagesContainerRef.current?.getElementsByClassName("page");
    if (!pages) return;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (i % 2 === 0) {
        page.style.zIndex = pages.length - i;
      }
      page.pageNum = i + 1;
      page.onclick = function () {
        if (this.pageNum % 2 === 0) {
          this.classList.remove("flipped");
          if (this.previousElementSibling) {
            this.previousElementSibling.classList.remove("flipped");
          }
        } else {
          this.classList.add("flipped");
          if (this.nextElementSibling) {
            this.nextElementSibling.classList.add("flipped");
          }
        }
      };
    }
  };

  const nextPage = () => {
    const pages = pagesContainerRef.current?.getElementsByClassName("page");
    if (!pages) return;

    for (let i = 0; i < pages.length; i += 2) {
      if (!pages[i].classList.contains("flipped")) {
        pages[i].classList.add("flipped");
        if (pages[i + 1]) {
          pages[i + 1].classList.add("flipped");
        }
        setCurrentPage(i + 2);
        break;
      }
    }
  };

  const prevPage = () => {
    const pages = pagesContainerRef.current?.getElementsByClassName("page");
    if (!pages) return;

    for (let i = pages.length - 2; i >= 0; i -= 2) {
      if (pages[i].classList.contains("flipped")) {
        pages[i].classList.remove("flipped");
        if (pages[i + 1]) {
          pages[i + 1].classList.remove("flipped");
        }
        setCurrentPage(i);
        break;
      }
    }
  };

  const zoomIn = () => setZoom(Math.min(zoom * 1.2, 3));
  const zoomOut = () => setZoom(Math.max(zoom / 1.2, 0.5));
  const resetZoom = () => setZoom(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          prevPage();
          break;
        case "ArrowRight":
          nextPage();
          break;
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, onClose]);

  const ReaderContent = () => (
    <Box
      sx={{
        height: isFullscreen ? "100vh" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box display="flex" alignItems="center" gap={2} flex={1}>
            <Book />
            <Box>
              <Typography variant="h6">{data.title}</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                <Chip label={`${data.pages.length} pages`} size="small" />
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(data.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={zoomOut} size="small">
              <ZoomOut />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ minWidth: 60, textAlign: "center" }}
            >
              {Math.round(zoom * 100)}%
            </Typography>
            <IconButton onClick={zoomIn} size="small">
              <ZoomIn />
            </IconButton>
            <IconButton onClick={resetZoom} size="small">
              <Refresh />
            </IconButton>
            <IconButton onClick={toggleFullscreen} size="small">
              <Fullscreen />
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Reader Area */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        sx={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : "500px" }}
      >
        <Box
          className="flipbook-wrapper"
          sx={{
            transform: `scale(${zoom})`,
            transition: "transform 0.3s ease",
            display: "flex",
            justifyContent: "center",
            py: 4,
          }}
        >
          <div className="book">
            <div ref={pagesContainerRef} id="pages" className="pages">
              {/* Pages will be generated dynamically */}
            </div>
          </div>
        </Box>
      </Box>

      {/* Navigation Controls */}
      <Box p={2} bgcolor="white" borderTop="1px solid #ddd">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            startIcon={<ChevronLeft />}
            onClick={prevPage}
          >
            Previous
          </Button>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              Page {currentPage + 1}-
              {Math.min(currentPage + 2, data.pages.length)} of{" "}
              {data.pages.length}
            </Typography>

            {/* Page thumbnails */}
            <Box
              display="flex"
              gap={0.5}
              sx={{ maxWidth: 300, overflowX: "auto" }}
            >
              {data.pages.slice(0, 10).map((page, index) => (
                <Box
                  key={index}
                  component="button"
                  onClick={() => {
                    // Jump to specific page
                    const pages =
                      pagesContainerRef.current?.getElementsByClassName("page");
                    if (pages) {
                      // Reset all pages
                      for (let i = 0; i < pages.length; i++) {
                        pages[i].classList.remove("flipped");
                      }
                      // Flip pages up to the target
                      for (let i = 0; i < index; i += 2) {
                        pages[i].classList.add("flipped");
                        if (pages[i + 1]) {
                          pages[i + 1].classList.add("flipped");
                        }
                      }
                      setCurrentPage(index);
                    }
                  }}
                  sx={{
                    width: 32,
                    height: 40,
                    border: "1px solid",
                    borderColor:
                      index >= currentPage && index < currentPage + 2
                        ? "primary.main"
                        : "grey.300",
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    flexShrink: 0,
                    p: 0,
                    bgcolor: "transparent",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <img
                    src={page.imageData || "/placeholder.svg"}
                    alt={`Page ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={nextPage}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );

  if (isFullscreen) {
    return (
      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        TransitionComponent={Transition}
      >
        <ReaderContent />
      </Dialog>
    );
  }

  return (
    <Card sx={{ maxWidth: "100%", mx: "auto" }}>
      <ReaderContent />
    </Card>
  );
}
