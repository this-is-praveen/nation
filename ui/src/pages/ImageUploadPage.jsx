import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import axiosClient from "../utils/apiClient"

const ImageUploadPage = () => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosClient.post('/insert-document', null, {
        params: {
          name,
          image_url: imageUrl
        }
      });

      if (response.data.status === 'success') {
        setSuccess(`Document uploaded successfully! ID: ${response.data.id}`);
      }
    } catch (err) {
        console.log('err :>> ', err);
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '90vh',
      bgcolor: 'background.default',
      p: 3
    }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: '600px',
        p: 4,
        borderRadius: 4
      }}>
        <Typography variant="h4" gutterBottom sx={{ 
          mb: 4,
          fontWeight: 600,
          color: 'primary.main'
        }}>
          Upload New Document
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Document Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Image URL"
              variant="outlined"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              type="url"
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Upload Document'
              )}
            </Button>
          </Box>
        </form>

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box sx={{ 
              mt: 4,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 3,
              position: 'relative',
              bgcolor: 'background.paper'
            }}>
              <Avatar
                variant="square"
                src={imageUrl}
                sx={{
                  width: '100%',
                  height: '300px',
                  borderRadius: 3
                }}
              />
              <Typography variant="caption" sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                px: 1,
                borderRadius: 1
              }}>
                Preview
              </Typography>
            </Box>
          </motion.div>
        )}
      </Paper>
    </Box>
  );
};

export default ImageUploadPage;