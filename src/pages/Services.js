import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
} from "@mui/material";

const Services = () => {
  const services = [
    {
      title: "Voice Recognition Solutions",
      description:
        "Custom voice recognition systems for various applications, from home automation to enterprise solutions.",
      price: "Starting at ₹999",
    },
    {
      title: "UI/UX Design",
      description:
        "User-centered design services that focus on creating intuitive and accessible interfaces for all users.",
      price: "Starting at ₹1,499",
    },
    {
      title: "Custom Software Development",
      description:
        "Bespoke software solutions tailored to your specific business needs and requirements.",
      price: "Starting at ₹2,999",
    },
    {
      title: "AI Integration",
      description:
        "Integrate artificial intelligence capabilities into your existing systems to enhance functionality.",
      price: "Starting at ₹3,499",
    },
    {
      title: "Maintenance & Support",
      description:
        "Ongoing technical support and maintenance services to ensure your systems run smoothly.",
      price: "Starting at ₹499/month",
    },
    {
      title: "Training & Workshops",
      description:
        "Comprehensive training programs to help your team make the most of new technologies.",
      price: "Starting at ₹799",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="body1" paragraph>
          We offer a range of services designed to help businesses leverage the
          latest technologies for improved efficiency and user experience.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={service.title}
                  titleTypographyProps={{ variant: "h6" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">{service.description}</Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 2, fontWeight: "bold" }}
                  >
                    {service.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                  <Button size="small" color="secondary">
                    Request Quote
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Services;
