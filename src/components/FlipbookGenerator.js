import { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  Alert,
  Chip,
  Paper,
  Snackbar,
} from "@mui/material";
import {
  Upload,
  InsertDriveFile,
  Download,
  Visibility,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";
import "./FlipbookGenerator.css";

export default function FlipbookGenerator({ onOpenFlipbook }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [processedPages, setProcessedPages] = useState(0);
  const fileInputRef = useRef(null);
  const pagesContainerRef = useRef(null);

  useEffect(() => {
    // Check if PDF.js is loaded
    if (!window.pdfjsLib) {
      console.error("PDF.js library not loaded!");
      setError(
        "PDF.js library not loaded. Please refresh the page and try again."
      );

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js";
      script.onload = () => {
        console.log("PDF.js loaded dynamically");
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
      };
      document.head.appendChild(script);
    } else {
      console.log("PDF.js library detected");
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
    }
  }, []);

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB.");
      return;
    }

    // Reset states
    setError(null);
    setPdfFile(file);
    setPdfPages([]);
    setTotalPages(0);
    setProcessedPages(0);
    setIsLoading(true);
    setProgress(0);
    setDownloadSuccess(false);

    try {
      await loadPDF(file);
    } catch (err) {
      setError("Failed to load PDF. Please try again.");
      console.error("PDF loading error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPDF = async (file) => {
    try {
      const pdfjsLib = window.pdfjsLib;
      if (!pdfjsLib) {
        throw new Error("PDF.js library not loaded");
      }

      console.log("Loading PDF file:", file.name);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      console.log(`PDF loaded successfully. Total pages: ${numPages}`);
      setTotalPages(numPages);

      if (numPages === 0) {
        setError("The PDF file appears to be empty or corrupted.");
        return;
      }

      // Process pages without relying on DOM container
      await processAllPages(numPages, pdf);
    } catch (err) {
      console.error("Error in loadPDF:", err);
      setError(`Failed to load PDF: ${err.message || "Unknown error"}`);
      throw err;
    }
  };

  const processAllPages = async (numPages, pdf) => {
    console.log(`Starting to process ${numPages} pages`);
    const pagesData = [];

    try {
      // Process pages sequentially
      for (let i = 1; i <= numPages; i++) {
        console.log(`Processing page ${i} of ${numPages}`);

        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });

          // Create canvas for rendering
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          // Set canvas size
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // Render page to canvas
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          // Get image data
          const imageData = canvas.toDataURL("image/jpeg", 0.8);

          // Store page data
          const pageData = {
            pageNum: i,
            imageData,
            width: viewport.width,
            height: viewport.height,
          };

          pagesData.push(pageData);
          console.log(`Page ${i} processed successfully`);

          // Update progress and processed pages count
          const currentProgress = (i / numPages) * 100;
          setProgress(currentProgress);
          setProcessedPages(i);

          // Update pdfPages state incrementally so buttons become enabled
          setPdfPages([...pagesData]);

          console.log(
            `Progress: ${currentProgress.toFixed(1)}% (${i}/${numPages})`
          );
        } catch (pageError) {
          console.error(`Error processing page ${i}:`, pageError);
          // Continue with other pages even if one fails
        }
      }

      console.log(`Total pages processed: ${pagesData.length}`);

      if (pagesData.length === 0) {
        setError(
          "Failed to process any pages from the PDF. The file might be corrupted."
        );
        return;
      }

      // Final update with all pages
      setPdfPages(pagesData);
      console.log("All pages processed successfully:", pagesData.length);
    } catch (err) {
      console.error("Error in processAllPages:", err);
      setError("Failed to process PDF pages.");
    }
  };

  const generateFlipbookDisplay = () => {
    const pagesContainer = pagesContainerRef.current;
    if (!pagesContainer || pdfPages.length === 0) return;

    console.log("Generating flipbook display with", pdfPages.length, "pages");
    pagesContainer.innerHTML = "";

    pdfPages.forEach((pageData, index) => {
      const pageDiv = document.createElement("div");
      pageDiv.className = "page";

      const img = document.createElement("img");
      img.src = pageData.imageData;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";

      pageDiv.appendChild(img);
      pagesContainer.appendChild(pageDiv);
    });

    // Setup page interactions
    setTimeout(() => {
      setupPages();
    }, 100);
  };

  const setupPages = () => {
    const pages = pagesContainerRef.current?.getElementsByClassName("page");
    if (!pages) {
      console.log("No pages found for setup");
      return;
    }

    console.log(`Setting up ${pages.length} pages for interaction`);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (i % 2 === 0) {
        page.style.zIndex = pages.length - i;
      }
      page.pageNum = i + 1;
      page.onclick = function () {
        console.log(`Clicked page ${this.pageNum}`);
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

  // Generate display when pages are ready
  useEffect(() => {
    if (pdfPages.length > 0 && !isLoading) {
      setTimeout(() => {
        generateFlipbookDisplay();
      }, 100);
    }
  }, [pdfPages.length, isLoading]);

  const downloadFlipbook = async () => {
    console.log("Download button clicked");
    console.log("PDF File:", pdfFile?.name);
    console.log("PDF Pages:", pdfPages.length);

    if (!pdfFile || pdfPages.length === 0) {
      setError(
        "No flipbook data available for download. Please upload and process a PDF first."
      );
      return;
    }

    setIsDownloading(true);

    try {
      const flipbookData = {
        title: pdfFile.name.replace(".pdf", ""),
        pages: pdfPages,
        createdAt: new Date().toISOString(),
        version: "1.0",
        signature: "FLIPBOOK_STUDIO_" + Date.now(),
      };

      console.log("Creating flipbook data:", {
        title: flipbookData.title,
        pageCount: flipbookData.pages.length,
      });

      const jsonString = JSON.stringify(flipbookData);
      const blob = new Blob([jsonString], {
        type: "application/json",
      });

      console.log("Blob created, size:", blob.size, "bytes");

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${flipbookData.title}.flipbook`;
      a.style.display = "none";

      // Add to DOM and trigger download
      document.body.appendChild(a);
      console.log("Triggering download for:", a.download);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      console.log("Download completed successfully");
      setDownloadSuccess(true);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download flipbook. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const openInViewer = () => {
    console.log("Open in viewer clicked");
    if (!pdfFile || pdfPages.length === 0) {
      setError(
        "No flipbook data available. Please upload and process a PDF first."
      );
      return;
    }

    const flipbookData = {
      title: pdfFile.name.replace(".pdf", ""),
      pages: pdfPages,
      createdAt: new Date().toISOString(),
      version: "1.0",
      signature: "FLIPBOOK_STUDIO_" + Date.now(),
    };

    const blob = new Blob([JSON.stringify(flipbookData)], {
      type: "application/json",
    });

    const file = new File([blob], `${flipbookData.title}.flipbook`, {
      type: "application/json",
    });

    onOpenFlipbook(file);
  };

  return (
    <Box maxWidth="1200px" mx="auto">
      {/* Upload Section */}
      <Card
        sx={{
          mb: 4,
          border: "2px dashed #ccc",
          "&:hover": { borderColor: "#1976d2" },
        }}
      >
        <CardHeader>
          <Typography
            variant="h5"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Upload />
            Upload PDF Document
          </Typography>
        </CardHeader>
        <CardContent>
          <Box textAlign="center" py={4}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={isLoading ? null : <CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? "Processing..." : "Choose PDF File"}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Select a PDF file to convert to flipbook (Max 50MB)
            </Typography>
          </Box>

          {pdfFile && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: "#e3f2fd" }}>
              <Box display="flex" alignItems="center" gap={2}>
                <InsertDriveFile sx={{ color: "#1976d2" }} />
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {pdfFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
                <Chip
                  label={`${pdfPages.length}/${totalPages} pages`}
                  color={
                    pdfPages.length === totalPages && totalPages > 0
                      ? "success"
                      : "primary"
                  }
                  variant="outlined"
                />
              </Box>
            </Paper>
          )}

          {isLoading && (
            <Box mt={2}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mt={1}
              >
                Processing PDF... {Math.round(progress)}% ({processedPages}/
                {totalPages} pages)
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* DOWNLOAD BUTTONS - Always visible after file is selected */}
          {pdfFile && (
            <Box
              mt={3}
              display="flex"
              gap={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Visibility />}
                onClick={openInViewer}
                disabled={pdfPages.length === 0}
                sx={{
                  minWidth: 200,
                  bgcolor: pdfPages.length > 0 ? "#1976d2" : "grey.400",
                }}
              >
                Open in Viewer ({pdfPages.length} pages)
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={isDownloading ? null : <Download />}
                onClick={downloadFlipbook}
                disabled={pdfPages.length === 0 || isDownloading}
                sx={{
                  minWidth: 200,
                  bgcolor: "white",
                  borderColor: pdfPages.length > 0 ? "#1976d2" : "grey.400",
                  color: pdfPages.length > 0 ? "#1976d2" : "grey.500",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                {isDownloading
                  ? "Downloading..."
                  : `Download Flipbook (${pdfPages.length} pages)`}
              </Button>
            </Box>
          )}

          {downloadSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle fontSize="small" />
                <Typography variant="body2">
                  <strong>Download Complete!</strong> Your flipbook file has
                  been saved to your Downloads folder.
                </Typography>
              </Box>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 3D Flipbook Preview - Always render the container */}
      <Card sx={{ mb: 4 }}>
        <CardHeader>
          <Typography variant="h5">3D Flipbook Preview</Typography>
          <Typography variant="body2" color="text.secondary">
            {pdfPages.length > 0
              ? "Click on pages to flip them. Hover over pages to see the 3D effect."
              : "Upload a PDF to see the preview here."}
          </Typography>
        </CardHeader>
        <CardContent>
          <Box
            className="flipbook-wrapper"
            sx={{ display: "flex", justifyContent: "center", py: 4 }}
          >
            <div className="book">
              <div ref={pagesContainerRef} id="pages" className="pages">
                {pdfPages.length === 0 && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="300px"
                    color="text.secondary"
                  >
                    <Typography variant="h6">
                      {isLoading
                        ? "Processing pages..."
                        : "No pages to display"}
                    </Typography>
                  </Box>
                )}
              </div>
            </div>
          </Box>

          {/* Additional Download Button Below Preview */}
          {pdfPages.length > 0 && (
            <Box mt={3} textAlign="center">
              <Button
                variant="contained"
                size="small"
                startIcon={<Download />}
                onClick={downloadFlipbook}
                disabled={isDownloading}
                sx={{
                  bgcolor: "#4caf50",
                  "&:hover": {
                    bgcolor: "#45a049",
                  },
                  minWidth: 250,
                  py: 1.5,
                }}
              >
                {isDownloading ? "Downloading..." : "📥 Download Your Flipbook"}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={downloadSuccess}
        autoHideDuration={4000}
        onClose={() => setDownloadSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setDownloadSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          <Typography variant="body2">
            <strong>✅ Download Complete!</strong> Check your Downloads folder
            for the .flipbook file.
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
}
