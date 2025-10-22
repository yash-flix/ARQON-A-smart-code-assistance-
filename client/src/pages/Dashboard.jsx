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
  CardActions,
  Avatar,
  Chip,
  alpha
} from '@mui/material';
import {
  Code,
  BugReport,
  Description,
  Logout,
  ArrowForward,
  TrendingUp
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
      icon: <Code sx={{ fontSize: 32 }} />,
      title: 'Code Analysis',
      description: 'Analyze your code for bugs, quality, and best practices',
      action: () => navigate('/code-editor'),
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <BugReport sx={{ fontSize: 32 }} />,
      title: 'Bug Fixer',
      description: 'AI-powered bug detection and automated fixing',
      action: () => navigate('/bug-fixer'),
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <Description sx={{ fontSize: 32 }} />,
      title: 'Documentation',
      description: 'Generate comprehensive code documentation automatically',
      action: () => navigate('/documentation'),
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  const usagePercentage = user.subscription === 'free' 
    ? Math.round((user.apiUsageCount / 50) * 100) 
    : 0;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto',
      py: 4,
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4,
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    mr: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    fontFamily: "'Poppins', 'Inter', sans-serif"
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontFamily: "'Poppins', 'Inter', sans-serif",
                      fontWeight: 600,
                      color: '#fff',
                      mb: 0.5,
                      letterSpacing: '-0.5px'
                    }}
                  >
                    Welcome back, {user.username}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: "'Inter', 'Segoe UI', sans-serif",
                      color: 'rgba(255, 255, 255, 0.6)' 
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Chip
                  label={user.subscription.toUpperCase()}
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    px: 1,
                    height: 32,
                    fontSize: '0.875rem'
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <TrendingUp sx={{ fontSize: 18, mr: 1, color: '#667eea' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: "'Inter', sans-serif",
                      color: '#fff', 
                      fontWeight: 500 
                    }}
                  >
                    {user.apiUsageCount} / {user.subscription === 'free' ? '50' : '∞'} API calls
                  </Typography>
                </Box>
                {user.subscription === 'free' && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: "'Inter', sans-serif",
                      color: usagePercentage > 80 ? '#f5576c' : 'rgba(255, 255, 255, 0.5)',
                      ml: 1
                    }}
                  >
                    ({usagePercentage}% used)
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  variant="outlined"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff'
                    }
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Features Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: "'Poppins', 'Inter', sans-serif",
              color: '#fff',
              fontWeight: 600,
              mb: 3,
              letterSpacing: '-0.5px'
            }}
          >
            AI-Powered Features
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(5deg)'
                    },
                    '& .arrow-icon': {
                      transform: 'translateX(4px)'
                    }
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box 
                    className="feature-icon"
                    sx={{ 
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <Box sx={{ color: '#fff' }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontFamily: "'Poppins', 'Inter', sans-serif",
                      color: '#fff',
                      fontWeight: 600,
                      mb: 1,
                      letterSpacing: '-0.3px'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: "'Inter', sans-serif",
                      color: 'rgba(255, 255, 255, 0.6)',
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    onClick={feature.action}
                    endIcon={<ArrowForward className="arrow-icon" sx={{ transition: 'transform 0.3s ease' }} />}
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      background: alpha('#fff', 0.05),
                      color: '#fff',
                      py: 1.25,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: alpha('#fff', 0.1),
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Stats */}
        <Paper 
          elevation={0}
          sx={{ 
            mt: 4,
            p: 3,
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 3
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            Ready to elevate your code quality? Start analyzing now.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard;
