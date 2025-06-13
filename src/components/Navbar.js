"use client";

import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
  Badge,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = ({ onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isContinuousListening, setIsContinuousListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Track navigation to ensure speech recognition continues after page changes
  const lastNavigationRef = useRef(null);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    // Initialize speech recognition
    initializeSpeechRecognition();

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  // Re-initialize recognition after navigation
  useEffect(() => {
    const currentPath = location.pathname;

    // If we navigated and continuous listening is active, ensure recognition is still running
    if (lastNavigationRef.current !== currentPath && isContinuousListening) {
      console.log(
        `Path changed to ${currentPath}, ensuring continuous listening is active`
      );

      // Short delay to let the page stabilize
      setTimeout(() => {
        if (isMountedRef.current && isContinuousListening) {
          // Stop any existing recognition and restart
          restartContinuousListening();
        }
      }, 500);
    }

    // Update last navigation path
    lastNavigationRef.current = currentPath;
  }, [location.pathname, isContinuousListening]);

  // Initialize the speech recognition object
  const initializeSpeechRecognition = () => {
    // Check browser support
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      showSnackbar(
        "Speech recognition is not supported in this browser",
        "error"
      );
      return false;
    }

    try {
      // Create new recognition instance if needed
      if (!recognitionRef.current) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
      }

      // Configure recognition settings
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false; // We'll handle continuous mode ourselves

      // Clear existing event listeners to prevent duplicates
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;

      // Set up event handlers
      recognitionRef.current.onresult = handleRecognitionResult;
      recognitionRef.current.onerror = handleRecognitionError;
      recognitionRef.current.onend = handleRecognitionEnd;

      return true;
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      return false;
    }
  };

  // Handle recognition results
  const handleRecognitionResult = (event) => {
    if (!isMountedRef.current) return;

    try {
      const transcript = event.results[0][0].transcript;
      console.log("Voice command detected:", transcript);
      setLastCommand(transcript);

      // Process the command
      processVoiceCommand(transcript);
    } catch (error) {
      console.error("Error processing recognition result:", error);
    }
  };

  // Handle recognition errors
  const handleRecognitionError = (event) => {
    if (!isMountedRef.current) return;

    console.error("Speech recognition error:", event.error);

    if (event.error === "not-allowed") {
      showSnackbar(
        "Microphone access denied. Please check permissions.",
        "error"
      );
      setIsContinuousListening(false);
      setIsListening(false);
    } else if (event.error === "network") {
      showSnackbar(
        "Network error. Will retry continuous listening shortly.",
        "warning"
      );
      // Will retry in onend handler
    } else {
      showSnackbar(`Recognition error: ${event.error}`, "error");
    }
  };

  // Handle recognition end event
  const handleRecognitionEnd = () => {
    if (!isMountedRef.current) return;

    console.log("Speech recognition ended");

    // Only set isListening to false if we're not in continuous mode
    if (!isContinuousListening) {
      setIsListening(false);
      return;
    }

    // In continuous mode, restart recognition after a short delay
    setTimeout(() => {
      restartContinuousListening();
    }, 300);
  };

  // Helper function to restart continuous listening
  const restartContinuousListening = () => {
    if (!isMountedRef.current || !isContinuousListening) return;

    try {
      // Reinitialize recognition to ensure clean state
      initializeSpeechRecognition();

      // Start listening again
      recognitionRef.current.start();
      console.log("Restarted continuous listening");

      // Ensure isListening state is true
      setIsListening(true);
    } catch (e) {
      console.error("Failed to restart continuous listening:", e);

      // If we can't restart immediately, try again after a delay
      setTimeout(() => {
        if (isMountedRef.current && isContinuousListening) {
          try {
            initializeSpeechRecognition();
            recognitionRef.current.start();
          } catch (error) {
            console.error("Failed second restart attempt:", error);
            setIsContinuousListening(false);
            setIsListening(false);
            showSnackbar(
              "Could not restart voice recognition. Please try again.",
              "error"
            );
          }
        }
      }, 1000);
    }
  };

  // Start listening (single or continuous mode)
  const startListening = (continuous = false) => {
    // Don't do anything if already in the requested state
    if (isListening && continuous === isContinuousListening) return;

    // Initialize or reset recognition
    if (!initializeSpeechRecognition()) {
      return;
    }

    try {
      // Update state before starting
      setIsContinuousListening(continuous);

      // Start recognition
      recognitionRef.current.start();
      setIsListening(true);

      if (continuous) {
        showSnackbar("Continuous listening activated", "success");
      }
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      showSnackbar(`Failed to start listening: ${error.message}`, "error");
      setIsListening(false);
      setIsContinuousListening(false);
    }
  };

  // Stop listening completely
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping
        console.log("Error stopping recognition:", e);
      }
    }

    // Update state
    setIsListening(false);
    setIsContinuousListening(false);
    showSnackbar("Listening stopped", "info");
  };

  // Toggle continuous listening mode
  const toggleContinuousListening = () => {
    if (isContinuousListening) {
      stopListening();
    } else {
      startListening(true);
    }
  };

  // Process voice commands through the backend
  const processVoiceCommand = async (command) => {
    if (!command || !isMountedRef.current) return;

    try {
      console.log("Sending command to backend:", command);

      const response = await axios.post(
        "http://localhost:8080/api/voice-command",
        { command },
        { headers: { "Content-Type": "application/json" } }
      );

      const { action, page, message } = response.data;
      console.log("Server response:", response.data);

      // Handle navigation
      if (action === "navigate" && page) {
        showSnackbar(`Navigating to ${page} page`, "success");
        console.log(`Navigating to: ${page}`);

        // Navigate to the page
        navigate(`/${page === "home" ? "" : page}`);

        // Notify parent component
        if (onVoiceCommand) {
          onVoiceCommand(command, action, page, message);
        }
      } else if (action === "unknown") {
        showSnackbar(message || "Command not recognized", "warning");
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
      showSnackbar("Server error. Please try again.", "error");

      // Fallback to frontend processing if backend fails
      if (onVoiceCommand) {
        onVoiceCommand(command);
      }
    }
  };

  // Show feedback to the user
  const showSnackbar = (message, severity = "info") => {
    if (!isMountedRef.current) return;

    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Voice Navigation
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/">
                  Home
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/about"
                >
                  About Us
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/services"
                >
                  Services
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/contact"
                >
                  Contact
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex" }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/about">
                About Us
              </Button>
              <Button color="inherit" component={Link} to="/services">
                Services
              </Button>
              <Button color="inherit" component={Link} to="/contact">
                Contact
              </Button>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1, ml: 2, alignItems: "center" }}>
            {lastCommand && (
              <Box
                sx={{
                  mr: 1,
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  bgcolor: "rgba(255,255,255,0.15)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.75rem",
                }}
              >
                "{lastCommand}"
              </Box>
            )}

            <Tooltip
              title={
                isListening && !isContinuousListening
                  ? "Listening for a single command..."
                  : "Click to speak once"
              }
            >
              <span>
                <IconButton
                  color="inherit"
                  onClick={() =>
                    isListening && !isContinuousListening
                      ? stopListening()
                      : startListening(false)
                  }
                  sx={{
                    animation:
                      isListening && !isContinuousListening
                        ? "pulse 1.5s infinite"
                        : "none",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.5 },
                      "100%": { opacity: 1 },
                    },
                  }}
                  disabled={isContinuousListening} // Disable when continuous mode is active
                >
                  {isListening && !isContinuousListening ? (
                    <Badge color="secondary" variant="dot">
                      <MicIcon />
                    </Badge>
                  ) : (
                    <MicIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip
              title={
                isContinuousListening
                  ? "Click to stop continuous listening"
                  : "Click to enable continuous listening"
              }
            >
              <Button
                variant={isContinuousListening ? "contained" : "outlined"}
                color={isContinuousListening ? "secondary" : "inherit"}
                onClick={toggleContinuousListening}
                startIcon={isContinuousListening ? <MicIcon /> : <MicOffIcon />}
                size="small"
                sx={{
                  animation: isContinuousListening
                    ? "pulse 1.5s infinite"
                    : "none",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                {isContinuousListening ? "Listening..." : "Continue"}
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;

// "use client";

// import { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   IconButton,
//   Box,
//   Menu,
//   MenuItem,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import MicIcon from "@mui/icons-material/Mic";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Navbar = ({ onVoiceCommand }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   // Speech recognition setup
//   useEffect(() => {
//     let recognition = null;

//     if ("webkitSpeechRecognition" in window) {
//       recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log("Voice command:", transcript);

//         // Process the command on the backend
//         processVoiceCommand(transcript);

//         setIsListening(false);
//       };

//       recognition.onerror = (event) => {
//         console.error("Speech recognition error", event.error);
//         setIsListening(false);
//       };

//       recognition.onend = () => {
//         setIsListening(false);
//       };
//     }

//     // Cleanup
//     return () => {
//       if (recognition) {
//         recognition.abort();
//       }
//     };
//   }, [onVoiceCommand]);

//   const startListening = () => {
//     if ("webkitSpeechRecognition" in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         console.log("Voice command:", transcript);

//         // Process the command on the backend
//         processVoiceCommand(transcript);
//       };

//       recognition.start();
//       setIsListening(true);

//       recognition.onend = () => {
//         setIsListening(false);
//       };
//     } else {
//       alert("Speech recognition is not supported in your browser.");
//     }
//   };

//   const processVoiceCommand = async (command) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/voice-command",
//         { command }
//       );
//       const { action, page } = response.data;

//       if (action === "navigate") {
//         onVoiceCommand(command);
//       }
//     } catch (error) {
//       console.error("Error processing voice command:", error);
//       // Fallback to frontend processing if backend fails
//       onVoiceCommand(command);
//     }
//   };

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           Voice Navigation
//         </Typography>

//         {isMobile ? (
//           <>
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               onClick={handleMenuClick}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//             >
//               <MenuItem onClick={handleMenuClose} component={Link} to="/">
//                 Home
//               </MenuItem>
//               <MenuItem onClick={handleMenuClose} component={Link} to="/about">
//                 About Us
//               </MenuItem>
//               <MenuItem
//                 onClick={handleMenuClose}
//                 component={Link}
//                 to="/services"
//               >
//                 Services
//               </MenuItem>
//               <MenuItem
//                 onClick={handleMenuClose}
//                 component={Link}
//                 to="/contact"
//               >
//                 Contact
//               </MenuItem>
//             </Menu>
//           </>
//         ) : (
//           <Box sx={{ display: "flex" }}>
//             <Button color="inherit" component={Link} to="/">
//               Home
//             </Button>
//             <Button color="inherit" component={Link} to="/about">
//               About Us
//             </Button>
//             <Button color="inherit" component={Link} to="/services">
//               Services
//             </Button>
//             <Button color="inherit" component={Link} to="/contact">
//               Contact
//             </Button>
//           </Box>
//         )}

//         <IconButton
//           color="inherit"
//           onClick={startListening}
//           sx={{
//             ml: 2,
//             animation: isListening ? "pulse 1.5s infinite" : "none",
//             "@keyframes pulse": {
//               "0%": { opacity: 1 },
//               "50%": { opacity: 0.5 },
//               "100%": { opacity: 1 },
//             },
//           }}
//         >
//           <MicIcon />
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
