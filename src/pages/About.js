import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import HistoryIcon from "@mui/icons-material/History";
import GroupsIcon from "@mui/icons-material/Groups";

const About = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          We are a forward-thinking company dedicated to creating innovative
          solutions that make technology more accessible and user-friendly.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <BusinessIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="body2">
                  To create intuitive and accessible technology solutions that
                  enhance the way people interact with digital systems.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <HistoryIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Our History
                </Typography>
                <Typography variant="body2">
                  Founded in 2015, we've been at the forefront of voice
                  recognition technology and user-friendly interfaces for over 8
                  years.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "info.main",
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <GroupsIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Our Team
                </Typography>
                <Typography variant="body2">
                  Our diverse team of experts brings together knowledge from
                  various fields to create holistic and innovative solutions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;
