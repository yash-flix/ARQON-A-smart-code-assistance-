import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Code,
  BugReport,
  Description,
  Logout,
  Person
} from '@mui/icons-material';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const features = [
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: 'Code Analysis',
      description: 'Analyze your code for bugs, quality, and best practices',
      action: () => navigate('/code-editor'),
      color: '#1976d2'
    },
    {
      icon: <BugReport sx={{ fontSize: 40 }} />,
      title: 'Bug Fixer',
      description: 'AI-powered bug detection and automated fixing',
      action: () => navigate('/code-editor'),
      color: '#dc004e'
    },
    {
      icon: <Description sx={{ fontSize: 40 }} />,
      title: 'Documentation',
      description: 'Generate comprehensive code documentation automatically',
      action: () => navigate('/code-editor'),
      color: '#2e7d32'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" gutterBottom>
                    Welcome, {user.username}! 👋
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ bgcolor: 'primary.light', color: 'white', px: 2, py: 0.5, borderRadius: 1 }}>
                  {user.subscription.toUpperCase()}
                </Typography>
                <Typography variant="body2" sx={{ bgcolor: 'secondary.light', color: 'white', px: 2, py: 0.5, borderRadius: 1 }}>
                  API Usage: {user.apiUsageCount} / {user.subscription === 'free' ? '50' : '∞'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          AI Features
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: feature.color, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={feature.action}
                    sx={{ bgcolor: feature.color }}
                  >
                    Try Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
