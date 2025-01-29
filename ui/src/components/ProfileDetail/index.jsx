import { motion } from 'framer-motion';
import { Paper, Typography, Box, Avatar } from '@mui/material';

const detailsVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

export const ProfileDetail = ({ profile }) => (
  <motion.div
    variants={detailsVariants}
    initial="hidden"
    animate="visible"
    style={{ position: 'sticky', top: 80 }}
  >
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ 
          bgcolor: 'secondary.main', 
          width: 120, 
          height: 120, 
          fontSize: '2.5rem' 
        }}>
          {profile?.name[0]}
        </Avatar>
        
        <Typography variant="h4">{profile?.name}</Typography>
        
        <Box sx={{ width: '100%', mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>ID:</strong> {profile?.id}
          </Typography>
          <Typography variant="body1">
            <strong>Last Updated:</strong> {new Date(profile?.updatedDate).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  </motion.div>
);