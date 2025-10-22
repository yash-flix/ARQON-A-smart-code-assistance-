import { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  TextField,
  Chip,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  alpha
} from '@mui/material';
import {
  BugReport,
  AutoFixHigh,
  CompareArrows,
  Send,
  Code as CodeIcon,
  CheckCircle
} from '@mui/icons-material';
import API from '../utils/api';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' }
];

function BugFixer() {
  const [code, setCode] = useState('// Paste your buggy code here\n\nfunction example() {\n  // Your code\n}');
  const [language, setLanguage] = useState('javascript');
  const [bugDescription, setBugDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFixBug = async () => {
    if (!code.trim()) {
      setError('Please provide some code to fix');
      return;
    }

    if (!bugDescription.trim()) {
      setError('Please describe the bug you want to fix');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await API.post('/code/fix-bug', {
        code,
        bugDescription,
        language
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fix bug');
    } finally {
      setLoading(false);
    }
  };

  const applyFix = () => {
    if (result?.fixedCode) {
      setCode(result.fixedCode);
      setResult(null);
      setBugDescription('');
    }
  };

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
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BugReport sx={{ color: '#f093fb', fontSize: 32, mr: 1.5 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#fff',
                fontWeight: 600,
                letterSpacing: '-0.5px',
                fontFamily: "'Poppins', 'Inter', sans-serif"
              }}
            >
              ARQON - Bug Fixer
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Describe your bug and let AI automatically fix your code
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Panel - Code Editor */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 3,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <FormControl 
                    size="small" 
                    sx={{ 
                      minWidth: 150,
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontFamily: "'Inter', sans-serif",
                        '& fieldset': { border: 'none' },
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: "'Inter', sans-serif"
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 255, 255, 0.6)'
                      }
                    }}
                  >
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={language}
                      label="Language"
                      onChange={(e) => setLanguage(e.target.value)}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#2d2d2d',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '& .MuiMenuItem-root': {
                              color: '#fff',
                              fontFamily: "'Inter', sans-serif",
                              '&:hover': { bgcolor: 'rgba(240, 147, 251, 0.2)' },
                              '&.Mui-selected': {
                                bgcolor: 'rgba(240, 147, 251, 0.3)',
                                '&:hover': { bgcolor: 'rgba(240, 147, 251, 0.4)' }
                              }
                            }
                          }
                        }
                      }}
                    >
                      {LANGUAGES.map((lang) => (
                        <MenuItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Bug Description */}
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Describe the bug you want to fix (e.g., 'The function returns undefined', 'Array index out of bounds error')"
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontFamily: "'Inter', sans-serif",
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' }
                    }
                  }}
                />

                {/* Fix Button */}
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <AutoFixHigh />}
                  onClick={handleFixBug}
                  disabled={loading}
                  fullWidth
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: '#fff',
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f5a4fc 0%, #f66b7c 100%)',
                      boxShadow: '0 6px 16px rgba(240, 147, 251, 0.5)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)'
                    },
                    transition: 'all 0.3s ease',
                    mb: 2
                  }}
                >
                  {loading ? 'Fixing Bug...' : 'Fix Bug with AI'}
                </Button>

                {/* Code Editor */}
                <Box sx={{ 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                  <Editor
                    height="calc(100vh - 480px)"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                      padding: { top: 16, bottom: 16 }
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Panel - Fixed Code Result */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 3,
                p: 3,
                height: 'calc(100vh - 180px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CodeIcon sx={{ color: '#f093fb', mr: 1.5, fontSize: 28 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: '-0.3px',
                    fontFamily: "'Poppins', 'Inter', sans-serif"
                  }}
                >
                  Fixed Code
                </Typography>
              </Box>

              <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 2,
                      bgcolor: 'rgba(245, 87, 108, 0.1)',
                      border: '1px solid rgba(245, 87, 108, 0.3)',
                      color: '#f5576c',
                      fontFamily: "'Inter', sans-serif",
                      '& .MuiAlert-icon': { color: '#f5576c' }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {loading && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: 400 
                  }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                      <CircularProgress 
                        size={70}
                        thickness={3}
                        sx={{ 
                          color: '#f093fb',
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 }
                          }
                        }} 
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AutoFixHigh sx={{ color: '#f093fb', fontSize: 30 }} />
                      </Box>
                    </Box>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: '1.1rem'
                      }}
                    >
                      Fixing your bug with AI...
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem'
                      }}
                    >
                      This may take a few seconds
                    </Typography>
                  </Box>
                )}

                {!loading && !result && !error && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    color: 'rgba(255, 255, 255, 0.4)', 
                    mt: 12 
                  }}>
                    <Box sx={{ 
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(240, 147, 251, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 3
                    }}>
                      <AutoFixHigh sx={{ fontSize: 50, color: '#f093fb', opacity: 0.5 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        mb: 1,
                        fontFamily: "'Poppins', 'Inter', sans-serif"
                      }}
                    >
                      Ready to fix bugs
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.3)',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      Describe the bug and click "Fix Bug with AI"
                    </Typography>
                  </Box>
                )}

                {result && (
                  <Box>
                    {/* Explanation Card */}
                    <Card 
                      elevation={0}
                      sx={{ 
                        mb: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: 2
                      }}
                    >
                      <CardContent sx={{ py: 2.5 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: 600,
                            mb: 1,
                            fontFamily: "'Inter', sans-serif",
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          Explanation
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#fff',
                            lineHeight: 1.6,
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          {result.explanation || 'No explanation provided'}
                        </Typography>
                      </CardContent>
                    </Card>

                    {/* Changes Made */}
                    {result.changes && result.changes.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CompareArrows sx={{ color: '#4facfe', mr: 1, fontSize: 22 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '1rem',
                              fontFamily: "'Poppins', 'Inter', sans-serif"
                            }}
                          >
                            Changes Made
                          </Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                          {result.changes.map((change, index) => (
                            <ListItem 
                              key={index}
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                mb: 1,
                                borderRadius: 2,
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                p: 1.5
                              }}
                            >
                              <CheckCircle sx={{ color: '#4facfe', mr: 1.5, fontSize: 20 }} />
                              <ListItemText 
                                primary={change}
                                primaryTypographyProps={{
                                  sx: { 
                                    color: 'rgba(255, 255, 255, 0.8)', 
                                    fontSize: '0.9rem',
                                    fontFamily: "'Inter', sans-serif"
                                  }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Fixed Code Preview */}
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.6)',
                          mb: 1.5,
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600
                        }}
                      >
                        Fixed Code:
                      </Typography>
                      <Box sx={{ 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}>
                        <Editor
                          height="300px"
                          language={language}
                          value={result.fixedCode || '// No fixed code provided'}
                          theme="vs-dark"
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                            padding: { top: 16, bottom: 16 }
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Apply Fix Button */}
                    <Button
                      variant="contained"
                      startIcon={<CheckCircle />}
                      onClick={applyFix}
                      fullWidth
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: '#fff',
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5fbdff 0%, #10f3ff 100%)',
                          boxShadow: '0 6px 16px rgba(79, 172, 254, 0.5)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Apply Fixed Code
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default BugFixer;
