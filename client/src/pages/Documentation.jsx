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
  Card,
  CardContent
} from '@mui/material';
import {
  Description,
  AutoAwesome,
  Send,
  Code as CodeIcon,
  ContentCopy
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

function Documentation() {
  const [code, setCode] = useState('// Paste your code here to generate documentation\n\nfunction calculateSum(a, b) {\n  return a + b;\n}');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [documentation, setDocumentation] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateDocs = async () => {
    if (!code.trim()) {
      setError('Please provide some code to document');
      return;
    }

    setLoading(true);
    setError('');
    setDocumentation('');

    try {
      const response = await API.post('/code/generate-docs', {
        code,
        language
      });

      setDocumentation(response.data.documentation || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate documentation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDocs = () => {
    navigator.clipboard.writeText(documentation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <Description sx={{ color: '#4facfe', fontSize: 32, mr: 1.5 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#fff',
                fontWeight: 600,
                letterSpacing: '-0.5px',
                fontFamily: "'Poppins', 'Inter', sans-serif"
              }}
            >
              AEQON - Documentation Generator
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Generate comprehensive code documentation automatically
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
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
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
                              '&:hover': { bgcolor: 'rgba(79, 172, 254, 0.2)' },
                              '&.Mui-selected': {
                                bgcolor: 'rgba(79, 172, 254, 0.3)',
                                '&:hover': { bgcolor: 'rgba(79, 172, 254, 0.4)' }
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

                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <Send />}
                    onClick={handleGenerateDocs}
                    disabled={loading}
                    fullWidth
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: '#fff',
                      py: 1,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5fbdff 0%, #10f3ff 100%)',
                        boxShadow: '0 6px 16px rgba(79, 172, 254, 0.5)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? 'Generating...' : 'Generate Docs'}
                  </Button>
                </Box>

                <Box sx={{ 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                  <Editor
                    height="calc(100vh - 280px)"
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

          {/* Right Panel - Documentation */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ color: '#4facfe', mr: 1.5, fontSize: 28 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#fff',
                      fontWeight: 600,
                      letterSpacing: '-0.3px',
                      fontFamily: "'Poppins', 'Inter', sans-serif"
                    }}
                  >
                    Generated Documentation
                  </Typography>
                </Box>
                {documentation && (
                  <Button
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyDocs}
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: copied ? '#4facfe' : 'rgba(255, 255, 255, 0.6)',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(79, 172, 254, 0.1)'
                      }
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
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
                          color: '#4facfe',
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
                        <AutoAwesome sx={{ color: '#4facfe', fontSize: 30 }} />
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
                      Generating documentation...
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

                {!loading && !documentation && !error && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    color: 'rgba(255, 255, 255, 0.4)', 
                    mt: 12 
                  }}>
                    <Box sx={{ 
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(79, 172, 254, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 3
                    }}>
                      <Description sx={{ fontSize: 50, color: '#4facfe', opacity: 0.5 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        mb: 1,
                        fontFamily: "'Poppins', 'Inter', sans-serif"
                      }}
                    >
                      Ready to generate docs
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.3)',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      Paste your code and click "Generate Docs"
                    </Typography>
                  </Box>
                )}

                {documentation && (
                  <Card 
                    elevation={0}
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2
                    }}
                  >
                    <CardContent>
                      <Box 
                        sx={{ 
                          fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: 1.8,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {documentation}
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Documentation;
