import { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Stack } from '@mui/material';
import { useSettings } from '../contexts/SettingsContext';

const DevTools = () => {
  const { settings, updateSettings } = useSettings();
  const [newBaseUrl, setNewBaseUrl] = useState(settings.apiBaseUrl);

  const handleSave = () => {
    updateSettings({ apiBaseUrl: newBaseUrl });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Development Tools
        </Typography>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="API Base URL"
            value={newBaseUrl}
            onChange={(e) => setNewBaseUrl(e.target.value)}
            variant="outlined"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ width: 150 }}
          >
            Save Settings
          </Button>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Current Configuration
            </Typography>
            <pre>
              {JSON.stringify({
                apiBaseUrl: settings.apiBaseUrl,
                axiosConfig: {
                  baseURL: settings.apiBaseUrl,
                  timeout: 10000
                }
              }, null, 2)}
            </pre>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DevTools;