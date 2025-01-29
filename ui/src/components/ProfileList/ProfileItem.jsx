import { motion } from 'framer-motion';
import { ListItem, ListItemButton, Typography, Avatar } from '@mui/material';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const ProfileItem = ({ profile, onSelect, selected }) => (
  <motion.div variants={itemVariants}>
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => onSelect(profile.id)}
        selected={selected}
        sx={{
          borderRadius: 2,
          gap: 2,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            '& .MuiTypography-root': { color: 'common.black' }
          }
        }}
      >
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          {profile.name[0]}
        </Avatar>
        <Typography variant="body1">{profile.name}</Typography>
      </ListItemButton>
    </ListItem>
  </motion.div>
);