"use client"

import { useState } from "react"
import { Box, Button, Typography } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"

export default function FlipbookPreview({ pages }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  const nextPage = () => {
    if (currentPage < pages.length - 2) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 2)
        setIsFlipping(false)
      }, 300)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 2)
        setIsFlipping(false)
      }, 300)
    }
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        bgcolor="#f5f5f5"
        borderRadius={2}
        overflow="hidden"
        position="relative"
        sx={{ perspective: "1000px" }}
      >
        <Box
          sx={{
            display: "flex",
            width: { xs: "300px", md: "600px" },
            height: { xs: "200px", md: "400px" },
            position: "relative",
            transformStyle: "preserve-3d",
            transition: isFlipping ? "transform 0.3s ease" : "none",
          }}
        >
          {/* Left Page */}
          <Box
            sx={{
              width: { xs: "150px", md: "300px" },
              height: { xs: "200px", md: "400px" },
              bgcolor: "white",
              border: "1px solid #ddd",
              borderRadius: "8px 0 0 8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformOrigin: "right center",
              transform: isFlipping ? "rotateY(-15deg)" : "none",
              transition: "transform 0.3s ease",
            }}
          >
            {pages[currentPage] && (
              <img
                src={pages[currentPage].imageData || "/placeholder.svg"}
                alt={`Page ${currentPage + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>

          {/* Right Page */}
          <Box
            sx={{
              width: { xs: "150px", md: "300px" },
              height: { xs: "200px", md: "400px" },
              bgcolor: "white",
              border: "1px solid #ddd",
              borderRadius: "0 8px 8px 0",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformOrigin: "left center",
              transform: isFlipping ? "rotateY(15deg)" : "none",
              transition: "transform 0.3s ease",
            }}
          >
            {pages[currentPage + 1] && (
              <img
                src={pages[currentPage + 1].imageData || "/placeholder.svg"}
                alt={`Page ${currentPage + 2}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          variant="outlined"
          startIcon={<ChevronLeft />}
          onClick={prevPage}
          disabled={currentPage === 0}
          size="small"
        >
          Previous
        </Button>

        <Typography variant="body2" color="text.secondary">
          Page {currentPage + 1}-{Math.min(currentPage + 2, pages.length)} of {pages.length}
        </Typography>

        <Button
          variant="outlined"
          endIcon={<ChevronRight />}
          onClick={nextPage}
          disabled={currentPage >= pages.length - 2}
          size="small"
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}
