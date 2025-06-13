"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show success message
    setSnackbar({
      open: true,
      message: "Your message has been sent successfully!",
      severity: "success",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          We'd love to hear from you. Please fill out the form below or use our
          contact information to get in touch.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOnIcon
                        sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Our Address
                        </Typography>
                        <Typography variant="body2">
                          123 Innovation Street, Tech City, TC 12345
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <PhoneIcon
                        sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Phone Number
                        </Typography>
                        <Typography variant="body2">
                          +1 (555) 123-4567
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <EmailIcon
                        sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Email Address
                        </Typography>
                        <Typography variant="body2">
                          info@voicenavigation.com
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;

// import { useState } from "react";
// import {
//   Container,
//   Typography,
//   Paper,
//   Grid,
//   TextField,
//   Button,
//   Box,
//   Card,
//   CardContent,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import PhoneIcon from "@mui/icons-material/Phone";
// import EmailIcon from "@mui/icons-material/Email";
// import axios from "axios";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Send form data to backend
//       await axios.post("http://localhost:8080/api/contact", formData);

//       // Show success message
//       setSnackbar({
//         open: true,
//         message: "Your message has been sent successfully!",
//         severity: "success",
//       });

//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         subject: "",
//         message: "",
//       });
//     } catch (error) {
//       console.error("Error sending message:", error);

//       // Show error message
//       setSnackbar({
//         open: true,
//         message: "Failed to send message. Please try again later.",
//         severity: "error",
//       });
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({
//       ...prev,
//       open: false,
//     }));
//   };

//   return (
//     <Container maxWidth="lg">
//       <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Contact Us
//         </Typography>
//         <Typography variant="body1" paragraph>
//           We'd love to hear from you. Please fill out the form below or use our
//           contact information to get in touch.
//         </Typography>

//         <Grid container spacing={4} sx={{ mt: 2 }}>
//           <Grid item xs={12} md={6}>
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Your Name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     variant="outlined"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Email Address"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     variant="outlined"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Subject"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                     variant="outlined"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Message"
//                     name="message"
//                     multiline
//                     rows={4}
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     variant="outlined"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     size="large"
//                     fullWidth
//                   >
//                     Send Message
//                   </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Box sx={{ height: "100%" }}>
//               <Typography variant="h6" gutterBottom>
//                 Contact Information
//               </Typography>

//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <Card>
//                     <CardContent sx={{ display: "flex", alignItems: "center" }}>
//                       <LocationOnIcon
//                         sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
//                       />
//                       <Box>
//                         <Typography variant="subtitle1" fontWeight="bold">
//                           Our Address
//                         </Typography>
//                         <Typography variant="body2">
//                           123 Innovation Street, Tech City, TC 12345
//                         </Typography>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Card>
//                     <CardContent sx={{ display: "flex", alignItems: "center" }}>
//                       <PhoneIcon
//                         sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
//                       />
//                       <Box>
//                         <Typography variant="subtitle1" fontWeight="bold">
//                           Phone Number
//                         </Typography>
//                         <Typography variant="body2">
//                           +1 (555) 123-4567
//                         </Typography>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Card>
//                     <CardContent sx={{ display: "flex", alignItems: "center" }}>
//                       <EmailIcon
//                         sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
//                       />
//                       <Box>
//                         <Typography variant="subtitle1" fontWeight="bold">
//                           Email Address
//                         </Typography>
//                         <Typography variant="body2">
//                           info@voicenavigation.com
//                         </Typography>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default Contact;
