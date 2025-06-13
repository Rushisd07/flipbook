import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

// App content to have access to navigation
const AppContent = () => {
  const navigate = useNavigate();
  const [lastCommand, setLastCommand] = useState("");

  const handleVoiceCommand = (command, action, page, message) => {
    setLastCommand(command);

    // Log voice command handling
    console.log(
      `Voice command handled: ${command}, action: ${action}, page: ${page}`
    );

    // If there's no action/page from backend, do some simple frontend recognition
    if (!action && !page) {
      const commandLower = command.toLowerCase();

      if (commandLower.includes("home")) {
        navigate("/");
      } else if (commandLower.includes("about")) {
        navigate("/about");
      } else if (commandLower.includes("service")) {
        navigate("/services");
      } else if (commandLower.includes("contact")) {
        navigate("/contact");
      }
    }
  };

  return (
    <>
      <Navbar onVoiceCommand={handleVoiceCommand} />
      <Routes>
        <Route path="/" element={<Home lastCommand={lastCommand} />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
};

// Main App component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
// } from "react-router-dom";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Services from "./pages/Services";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#1976d2",
//     },
//     secondary: {
//       main: "#dc004e",
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <AppContent />
//       </Router>
//     </ThemeProvider>
//   );
// }

// function AppContent() {
//   const navigate = useNavigate();

//   // Function to handle voice commands
//   const handleVoiceCommand = (command) => {
//     const lowerCommand = command.toLowerCase();

//     if (lowerCommand.includes("home") || lowerCommand.includes("homepage")) {
//       navigate("/");
//     } else if (lowerCommand.includes("about")) {
//       navigate("/about");
//     } else if (lowerCommand.includes("contact")) {
//       navigate("/contact");
//     } else if (lowerCommand.includes("service")) {
//       navigate("/services");
//     }
//   };

//   return (
//     <div>
//       <Navbar onVoiceCommand={handleVoiceCommand} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/services" element={<Services />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
