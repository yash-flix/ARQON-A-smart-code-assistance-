import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
        padding: 3
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 3
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <PersonAdd sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
            <Typography
              variant="h4"
              sx={{
                color: '#fff',
                fontWeight: 600,
                mb: 1,
                fontFamily: "'Poppins', 'Inter', sans-serif"
              }}
            >
              Create Account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Sign up for ARQON AI Code Assistant
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: 'rgba(245, 87, 108, 0.1)',
                border: '1px solid rgba(245, 87, 108, 0.3)',
                color: '#f5576c',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: "'Inter', sans-serif"
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea'
                }
              }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: "'Inter', sans-serif"
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea'
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: "'Inter', sans-serif"
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea'
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <PersonAdd />}
              sx={{
                fontFamily: "'Inter', sans-serif",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c92f5 0%, #8b5bb3 100%)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup;
