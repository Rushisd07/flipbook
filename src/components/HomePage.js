import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Upload, Visibility, Download, CheckCircle } from "@mui/icons-material";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Easy PDF Upload",
      description:
        "Simply drag and drop your PDF files or click to browse. Supports files up to 50MB.",
      action: () => navigate("/generator"),
    },
    {
      icon: <Visibility sx={{ fontSize: 40, color: "#9c27b0" }} />,
      title: "Interactive Viewer",
      description:
        "View your flipbooks with realistic page turning animations and zoom controls.",
      action: () => navigate("/viewer"),
    },
    {
      icon: <Download sx={{ fontSize: 40, color: "#388e3c" }} />,
      title: "Secure Download",
      description:
        "Download your flipbooks as secure .flipbook files that only work in our application.",
      action: () => navigate("/generator"),
    },
  ];

  const benefits = [
    "High-quality page rendering",
    "Responsive design for all devices",
    "Secure file format",
    "Fast processing",
    "Professional animations",
    "Easy sharing options",
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1976d2, #9c27b0)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
            mt: 6,
          }}
        >
          Welcome to FlipBook Studio
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: 800, mx: "auto", mb: 4 }}
        >
          Transform your PDF documents into stunning interactive flipbooks with
          professional page-turning animations. Perfect for digital magazines,
          catalogs, brochures, and presentations.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            startIcon={<Upload />}
            onClick={() => navigate("/generator")}
            sx={{ px: 4, py: 1.5 }}
          >
            Create Flipbook
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Visibility />}
            onClick={() => navigate("/viewer")}
            sx={{ px: 4, py: 1.5 }}
          >
            Open Flipbook
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box mb={8}>
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          mb={4}
        >
          Key Features
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={4} // space between cards
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                width: { xs: "100%", sm: "45%", md: "30%" }, // responsive widths
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flex: 1, textAlign: "center", pt: 4 }}>
                <Box mb={2}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                <Button onClick={feature.action} variant="outlined">
                  Get Started
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Benefits Section */}
      <Grid
        container
        spacing={4}
        mb={8}
        justifyContent="center"
        alignItems="stretch" // makes both cards same height
      >
        <Grid item xs={12} md={6} display="flex">
          <Paper sx={{ p: 4, width: "100%" }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" mb={3}>
              Why Choose FlipBook Studio?
            </Typography>
            <List>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: "#4caf50" }} />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} display="flex">
          <Paper sx={{ p: 4, width: "100%", bgcolor: "#f8f9fa" }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" mb={3}>
              How It Works
            </Typography>
            <Box display="flex" flexDirection="column" gap={3}>
              {[
                {
                  color: "#1976d2",
                  text: "Upload your PDF document",
                  number: "1",
                },
                {
                  color: "#9c27b0",
                  text: "Preview your interactive flipbook",
                  number: "2",
                },
                {
                  color: "#388e3c",
                  text: "Download and share your flipbook",
                  number: "3",
                },
              ].map((step, index) => (
                <Box key={index} display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: step.color,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {step.number}
                  </Box>
                  <Typography>{step.text}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
