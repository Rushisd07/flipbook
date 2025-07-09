"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { Upload, Book, Warning, Visibility } from "@mui/icons-material";
import FlipbookReader from "./FlipbookReader";

export default function FlipbookViewer({ file: initialFile }) {
  const [flipbookData, setFlipbookData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFlipbook = (data) => {
    return (
      data &&
      typeof data.title === "string" &&
      Array.isArray(data.pages) &&
      typeof data.signature === "string" &&
      data.signature.startsWith("FLIPBOOK_STUDIO_")
    );
  };

  const loadFlipbook = useCallback(async (file) => {
    if (!file.name.endsWith(".flipbook")) {
      setError("Invalid file format. Please select a .flipbook file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateFlipbook(data)) {
        setError(
          "Invalid flipbook file. This file was not created by FlipBook Studio."
        );
        return;
      }

      setFlipbookData(data);
    } catch (err) {
      setError("Failed to load flipbook. The file may be corrupted.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileSelect = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        await loadFlipbook(file);
      }
    },
    [loadFlipbook]
  );

  useEffect(() => {
    if (initialFile) {
      loadFlipbook(initialFile);
    }
  }, [initialFile, loadFlipbook]);

  if (flipbookData) {
    return (
      <FlipbookReader
        data={flipbookData}
        onClose={() => setFlipbookData(null)}
      />
    );
  }

  return (
    <Box maxWidth="800px" mx="auto">
      <Card
        sx={{
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
            <Book />
            Open Flipbook
          </Typography>
        </CardHeader>
        <CardContent>
          <Box textAlign="center" py={6}>
            <Box mb={3}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#e3f2fd",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Visibility sx={{ fontSize: 32, color: "#1976d2" }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                Select a Flipbook to View
              </Typography>
              <Typography color="text.secondary">
                Choose a .flipbook file created with FlipBook Studio
              </Typography>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept=".flipbook"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            <Button
              variant="contained"
              size="large"
              startIcon={<Upload />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Choose Flipbook File"}
            </Button>

            <Paper
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "#fff3e0",
                border: "1px solid #ffcc02",
              }}
            >
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Warning sx={{ color: "#f57c00", mt: 0.5 }} />
                <Box textAlign="left">
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    color="#e65100"
                  >
                    Security Notice
                  </Typography>
                  <Typography variant="body2" color="#ef6c00" mt={0.5}>
                    This viewer only opens flipbooks created with FlipBook
                    Studio. Files from other sources will be rejected for
                    security.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

// "use client"

// import { useState, useRef, useCallback, useEffect } from "react"
// import { Box, Button, Card, CardContent, CardHeader, Typography, Alert, Paper } from "@mui/material"
// import { Upload, Book, Warning, Visibility } from "@mui/icons-material"
// import FlipbookReader from "./FlipbookReader"

// export default function FlipbookViewer({ file: initialFile }) {
//   const [flipbookData, setFlipbookData] = useState(null)
//   const [error, setError] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const fileInputRef = useRef(null)

//   const validateFlipbook = (data) => {
//     return (
//       data &&
//       typeof data.title === "string" &&
//       Array.isArray(data.pages) &&
//       typeof data.signature === "string" &&
//       data.signature.startsWith("FLIPBOOK_STUDIO_")
//     )
//   }

//   const loadFlipbook = useCallback(async (file) => {
//     if (!file.name.endsWith(".flipbook")) {
//       setError("Invalid file format. Please select a .flipbook file.")
//       return
//     }

//     setIsLoading(true)
//     setError(null)

//     try {
//       const text = await file.text()
//       const data = JSON.parse(text)

//       if (!validateFlipbook(data)) {
//         setError("Invalid flipbook file. This file was not created by FlipBook Studio.")
//         return
//       }

//       setFlipbookData(data)
//     } catch (err) {
//       setError("Failed to load flipbook. The file may be corrupted.")
//       console.error(err)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   const handleFileSelect = useCallback(
//     async (event) => {
//       const file = event.target.files?.[0]
//       if (file) {
//         await loadFlipbook(file)
//       }
//     },
//     [loadFlipbook],
//   )

//   useEffect(() => {
//     if (initialFile) {
//       loadFlipbook(initialFile)
//     }
//   }, [initialFile, loadFlipbook])

//   if (flipbookData) {
//     return <FlipbookReader data={flipbookData} onClose={() => setFlipbookData(null)} />
//   }

//   return (
//     <Box maxWidth="800px" mx="auto">
//       <Card sx={{ border: "2px dashed #ccc", "&:hover": { borderColor: "#1976d2" } }}>
//         <CardHeader>
//           <Typography variant="h5" component="h2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Book />
//             Open Flipbook
//           </Typography>
//         </CardHeader>
//         <CardContent>
//           <Box textAlign="center" py={6}>
//             <Box mb={3}>
//               <Box
//                 sx={{
//                   width: 64,
//                   height: 64,
//                   bgcolor: "#e3f2fd",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   mx: "auto",
//                   mb: 2,
//                 }}
//               >
//                 <Visibility sx={{ fontSize: 32, color: "#1976d2" }} />
//               </Box>
//               <Typography variant="h5" fontWeight="bold" mb={1}>
//                 Select a Flipbook to View
//               </Typography>
//               <Typography color="text.secondary">Choose a .flipbook file created with FlipBook Studio</Typography>
//             </Box>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".flipbook"
//               onChange={handleFileSelect}
//               style={{ display: "none" }}
//             />

//             <Button
//               variant="contained"
//               size="large"
//               startIcon={<Upload />}
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isLoading}
//             >
//               {isLoading ? "Loading..." : "Choose Flipbook File"}
//             </Button>

//             <Paper sx={{ mt: 3, p: 2, bgcolor: "#fff3e0", border: "1px solid #ffcc02" }}>
//               <Box display="flex" alignItems="flex-start" gap={2}>
//                 <Warning sx={{ color: "#f57c00", mt: 0.5 }} />
//                 <Box textAlign="left">
//                   <Typography variant="subtitle1" fontWeight="medium" color="#e65100">
//                     Security Notice
//                   </Typography>
//                   <Typography variant="body2" color="#ef6c00" mt={0.5}>
//                     This viewer only opens flipbooks created with FlipBook Studio. Files from other sources will be
//                     rejected for security.
//                   </Typography>
//                 </Box>
//               </Box>
//             </Paper>
//           </Box>

//           {error && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {error}
//             </Alert>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   )
// }
