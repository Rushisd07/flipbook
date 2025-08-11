import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Book,
  Upload,
  Visibility,
  Menu as MenuIcon,
  Home,
} from "@mui/icons-material";
import FlipbookGenerator from "./components/FlipbookGenerator";
import FlipbookViewer from "./components/FlipbookViewer";
import HomePage from "./components/HomePage";
import ScrollTop from "./components/ScrollTop";
import { useEffect } from "react";

// Navigation component
function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { label: "Home", path: "/", icon: <Home /> },
    { label: "Generator", path: "/generator", icon: <Upload /> },
    { label: "Viewer", path: "/viewer", icon: <Visibility /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    const selectedItem = navigationItems[newValue];
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const getCurrentTabIndex = () => {
    const currentIndex = navigationItems.findIndex(
      (item) => item.path === location.pathname
    );
    return currentIndex >= 0 ? currentIndex : 0;
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Book sx={{ fontSize: 32, color: "#1976d2" }} />
          <Typography variant="h6" fontWeight="bold">
            FlipBook Studio
          </Typography>
        </Box>
      </Box>
      <List>
        {navigationItems.map((item, index) => (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                "& .MuiListItemIcon-root": {
                  color: "#1976d2",
                },
                "& .MuiListItemText-primary": {
                  color: "#1976d2",
                  fontWeight: 600,
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{ bgcolor: "white", color: "text.primary" }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box display="flex" alignItems="center" gap={2} flex={1}>
            <Book sx={{ fontSize: 28, color: "#1976d2" }} />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                // display: { xs: "none", sm: "block" },
              }}
            >
              FlipBook Studio
            </Typography>
          </Box>

          {!isMobile && (
            <Tabs
              value={getCurrentTabIndex()}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  minHeight: 64,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            >
              {navigationItems.slice(0, 4).map((item) => (
                <Tab
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              ))}
            </Tabs>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

// Main App Layout
function AppLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #f3e5f5 100%)",
      }}
    >
      <Navigation />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
      <ScrollTop />
    </Box>
  );
}

// Route wrapper component for flipbook operations
function FlipbookRoutes() {
  const [viewerFile, setViewerFile] = useState(null);
  const navigate = useNavigate();

  const handleOpenFlipbook = (file) => {
    setViewerFile(file);
    navigate("/viewer");
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/generator"
        element={<FlipbookGenerator onOpenFlipbook={handleOpenFlipbook} />}
      />
      <Route path="/viewer" element={<FlipbookViewer file={viewerFile} />} />
      {/* <Route path="/about" element={<AboutPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/settings" element={<SettingsPage />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
function App() {
  useEffect(() => {
    // Initialize PDF.js
    if (window.pdfjsLib) {
      console.log("PDF.js initialized in App component");
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
    } else {
      console.error("PDF.js not found. Loading dynamically...");
      // Try to load PDF.js dynamically
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js";
      script.onload = () => {
        console.log("PDF.js loaded dynamically");
        window.pdfjsLib = window.pdfjsLib || {};
        window.pdfjsLib.GlobalWorkerOptions =
          window.pdfjsLib.GlobalWorkerOptions || {};
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <Router>
      <AppLayout>
        <FlipbookRoutes />
      </AppLayout>
      <ScrollTop />
    </Router>
  );
}

export default App;
