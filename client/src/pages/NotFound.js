import { Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;