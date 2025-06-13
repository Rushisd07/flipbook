import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Voice Navigation Demo
        </Typography>

        <Typography variant="body1" paragraph>
          This interactive demo showcases how voice commands can be used to
          navigate a web application. We've implemented two different voice
          control modes:
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{ flex: 1, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <MicIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Single Command Mode</Typography>
            </Box>
            <Typography variant="body2">
              Click the microphone icon in the navigation bar, speak a single
              command, and release. The system will process your command once
              and then stop listening. Perfect for quick navigation.
            </Typography>
          </Box>

          <Box
            sx={{ flex: 1, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PlayArrowIcon sx={{ mr: 1 }} color="secondary" />
              <Typography variant="h6">Continuous Listening Mode</Typography>
            </Box>
            <Typography variant="body2">
              Click the "Continue" button to enable always-on voice recognition.
              The system will keep listening until you click "Listening..." to
              turn it off. Ideal for hands-free navigation through multiple
              pages.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Try These Voice Commands:
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          <Chip label="Go to Home" color="primary" variant="outlined" />
          <Chip
            label="Navigate to About Us"
            color="primary"
            variant="outlined"
          />
          <Chip label="Show me Services" color="primary" variant="outlined" />
          <Chip label="Take me to Contact" color="primary" variant="outlined" />
          <Chip label="Who are you" color="secondary" variant="outlined" />
          <Chip
            label="What do you offer"
            color="secondary"
            variant="outlined"
          />
          <Chip label="How to reach you" color="secondary" variant="outlined" />
        </Box>

        <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> Voice recognition works best in Chrome
            browsers. Speak clearly and directly. If you encounter any issues,
            try refreshing the page or check your microphone permissions.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;

// import { Container, Typography, Paper, Box } from "@mui/material";

// const Home = () => {
//   return (
//     <Container maxWidth="lg">
//       <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Welcome to Our Home Page
//         </Typography>
//         <Typography variant="body1" paragraph>
//           This is a voice-controlled navigation demo. Click the microphone icon
//           in the navbar and say commands like:
//         </Typography>
//         <Box sx={{ pl: 2 }}>
//           <Typography variant="body1" component="div">
//             • "Go to Home"
//           </Typography>
//           <Typography variant="body1" component="div">
//             • "Navigate to About Us"
//           </Typography>
//           <Typography variant="body1" component="div">
//             • "Go to Services page"
//           </Typography>
//           <Typography variant="body1" component="div">
//             • "Take me to Contact"
//           </Typography>
//         </Box>
//         <Typography variant="body1" sx={{ mt: 2 }}>
//           The application will listen to your command and navigate to the
//           appropriate page.
//         </Typography>
//       </Paper>
//     </Container>
//   );
// };

// export default Home;
