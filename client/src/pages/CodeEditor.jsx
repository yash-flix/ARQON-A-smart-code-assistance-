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
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  alpha,
  LinearProgress
} from '@mui/material';
import {
  BugReport,
  AutoFixHigh,
  Security,
  Send,
  Code as CodeIcon,
  CheckCircle,
  Warning,
  Error as ErrorIcon
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

function CodeEditor() {
  const [code, setCode] = useState('// Write your code here\n\nfunction hello() {\n  console.log("Hello World");\n}');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please write some code to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await API.post('/code/analyze', {
        code,
        language
      });

      if (response.data.success) {
        setAnalysis(response.data.data.analysis);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze code');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#f5576c',
      high: '#f093fb',
      medium: '#ffd93d',
      low: '#4facfe'
    };
    return colors[severity?.toLowerCase()] || '#4facfe';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: <ErrorIcon />,
      high: <Warning />,
      medium: <Warning />,
      low: <CheckCircle />
    };
    return icons[severity?.toLowerCase()] || <CheckCircle />;
  };

  const getComplexityColor = (complexity) => {
    const colors = {
      low: '#4facfe',
      medium: '#ffd93d',
      high: '#f5576c'
    };
    return colors[complexity?.toLowerCase()] || '#4facfe';
  };

  const getQualityGradient = (score) => {
    if (score >= 80) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    if (score >= 60) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (score >= 40) return 'linear-gradient(135deg, #ffd93d 0%, #f093fb 100%)';
    return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
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
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#fff',
              fontWeight: 600,
              mb: 1,
              letterSpacing: '-0.5px',
              fontFamily: "'Poppins', 'Inter', sans-serif"
            }}
          >
            AI Code Assistant
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Analyze your code for bugs, get suggestions, and improve code quality
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
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.08)',
                        }
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
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.2)'
                              },
                              '&.Mui-selected': {
                                bgcolor: 'rgba(102, 126, 234, 0.3)',
                                '&:hover': {
                                  bgcolor: 'rgba(102, 126, 234, 0.4)'
                                }
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
                    onClick={handleAnalyze}
                    disabled={loading}
                    fullWidth
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      py: 1,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
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
                    {loading ? 'Analyzing...' : 'Analyze Code'}
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

          {/* Right Panel - Analysis Results */}
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
                <CodeIcon sx={{ color: '#667eea', mr: 1.5, fontSize: 28 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: '-0.3px',
                    fontFamily: "'Poppins', 'Inter', sans-serif"
                  }}
                >
                  Analysis Results
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
                      '& .MuiAlert-icon': {
                        color: '#f5576c'
                      }
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
                    <CircularProgress 
                      size={60}
                      thickness={4}
                      sx={{ 
                        color: '#667eea',
                        mb: 3
                      }} 
                    />
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      Analyzing your code...
                    </Typography>
                  </Box>
                )}

                {!loading && !analysis && !error && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    color: 'rgba(255, 255, 255, 0.4)', 
                    mt: 12 
                  }}>
                    <Box sx={{ 
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(102, 126, 234, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 3
                    }}>
                      <BugReport sx={{ fontSize: 50, color: '#667eea', opacity: 0.5 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        mb: 1,
                        fontFamily: "'Poppins', 'Inter', sans-serif"
                      }}
                    >
                      Ready to analyze
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.3)',
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      Write some code and click "Analyze Code" to get started
                    </Typography>
                  </Box>
                )}

                {analysis && (
                  <Box>
                    {/* Quality Score Card */}
                    <Card 
                      elevation={0}
                      sx={{ 
                        mb: 3,
                        background: getQualityGradient(analysis.qualityScore || 0),
                        border: 'none',
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Typography 
                          variant="h2" 
                          sx={{ 
                            color: '#fff',
                            fontWeight: 700,
                            mb: 1,
                            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            fontFamily: "'Poppins', 'Inter', sans-serif"
                          }}
                        >
                          {analysis.qualityScore || 0}
                          <Typography 
                            component="span" 
                            variant="h4" 
                            sx={{ 
                              opacity: 0.8,
                              fontFamily: "'Poppins', 'Inter', sans-serif"
                            }}
                          >
                            /100
                          </Typography>
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 500,
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          Code Quality Score
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={analysis.qualityScore || 0}
                          sx={{
                            mt: 2,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#fff',
                              borderRadius: 3
                            }
                          }}
                        />
                      </CardContent>
                    </Card>

                    {/* Complexity Chip */}
                    <Box sx={{ mb: 3 }}>
                      <Chip
                        label={`Complexity: ${(analysis.complexity || 'N/A').toUpperCase()}`}
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          bgcolor: alpha(getComplexityColor(analysis.complexity), 0.15),
                          color: getComplexityColor(analysis.complexity),
                          border: `1px solid ${alpha(getComplexityColor(analysis.complexity), 0.3)}`,
                          fontWeight: 600,
                          px: 1,
                          height: 32
                        }}
                      />
                    </Box>

                    {/* Bugs Section */}
                    {analysis.bugs && analysis.bugs.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <BugReport sx={{ color: '#f5576c', mr: 1, fontSize: 22 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '1rem',
                              fontFamily: "'Poppins', 'Inter', sans-serif"
                            }}
                          >
                            Bugs Found ({analysis.bugs.length})
                          </Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                          {analysis.bugs.map((bug, index) => (
                            <ListItem
                              key={index}
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                mb: 1.5,
                                borderRadius: 2,
                                border: `1px solid ${alpha(getSeverityColor(bug.severity), 0.3)}`,
                                p: 2,
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                                <Chip
                                  icon={getSeverityIcon(bug.severity)}
                                  label={bug.severity?.toUpperCase() || 'UNKNOWN'}
                                  size="small"
                                  sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    bgcolor: alpha(getSeverityColor(bug.severity), 0.15),
                                    color: getSeverityColor(bug.severity),
                                    border: `1px solid ${alpha(getSeverityColor(bug.severity), 0.3)}`,
                                    fontWeight: 600,
                                    '& .MuiChip-icon': {
                                      color: getSeverityColor(bug.severity)
                                    }
                                  }}
                                />
                                {bug.line && (
                                  <Chip 
                                    label={`Line ${bug.line}`} 
                                    size="small"
                                    sx={{
                                      fontFamily: "'Inter', sans-serif",
                                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      border: '1px solid rgba(255, 255, 255, 0.1)',
                                      fontWeight: 500
                                    }}
                                  />
                                )}
                              </Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#fff', 
                                  mb: bug.suggestion ? 1 : 0, 
                                  lineHeight: 1.6,
                                  fontFamily: "'Inter', sans-serif"
                                }}
                              >
                                {bug.message}
                              </Typography>
                              {bug.suggestion && (
                                <Box sx={{ 
                                  bgcolor: 'rgba(74, 172, 254, 0.1)',
                                  border: '1px solid rgba(74, 172, 254, 0.2)',
                                  borderRadius: 1,
                                  p: 1.5,
                                  width: '100%'
                                }}>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: '#4facfe',
                                      fontWeight: 500,
                                      display: 'flex',
                                      alignItems: 'center',
                                      fontFamily: "'Inter', sans-serif"
                                    }}
                                  >
                                    <AutoFixHigh sx={{ fontSize: 16, mr: 0.5 }} />
                                    {bug.suggestion}
                                  </Typography>
                                </Box>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Suggestions Section */}
                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AutoFixHigh sx={{ color: '#4facfe', mr: 1, fontSize: 22 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '1rem',
                              fontFamily: "'Poppins', 'Inter', sans-serif"
                            }}
                          >
                            Suggestions
                          </Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                          {analysis.suggestions.map((suggestion, index) => (
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
                              <ListItemText 
                                primary={suggestion}
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

                    {/* Security Issues Section */}
                    {analysis.securityIssues && analysis.securityIssues.length > 0 && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Security sx={{ color: '#f5576c', mr: 1, fontSize: 22 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#f5576c',
                              fontWeight: 600,
                              fontSize: '1rem',
                              fontFamily: "'Poppins', 'Inter', sans-serif"
                            }}
                          >
                            Security Issues
                          </Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                          {analysis.securityIssues.map((issue, index) => (
                            <ListItem 
                              key={index}
                              sx={{
                                bgcolor: 'rgba(245, 87, 108, 0.1)',
                                mb: 1,
                                borderRadius: 2,
                                border: '1px solid rgba(245, 87, 108, 0.3)',
                                p: 1.5
                              }}
                            >
                              <ListItemText 
                                primary={issue}
                                primaryTypographyProps={{
                                  sx: { 
                                    color: '#f5576c', 
                                    fontSize: '0.9rem', 
                                    fontWeight: 500,
                                    fontFamily: "'Inter', sans-serif"
                                  }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
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

export default CodeEditor;