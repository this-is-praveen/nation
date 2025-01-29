import { motion } from 'framer-motion';
import { Box, Alert } from '@mui/material';
import { useProfiles } from './useProfiles';
import { ProfileList } from '../../components/ProfileList';
import { ProfileDetail } from '../../components/ProfileDetail';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const ProfilesPage = () => {
  const {
    profiles,
    profileDetails,
    selectedProfile,
    setSelectedProfile,
    loadMore,
    hasMore,
    loading,
    loadingMore,
    isError
  } = useProfiles();

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: '2rem' }}
    >
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: 4,
        maxWidth: 1400,
        mx: 'auto'
      }}>
        <Box>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading profiles
            </Alert>
          )}

          <ProfileList
            profiles={profiles}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onSelect={setSelectedProfile}
            selectedProfile={selectedProfile}
          />
          
          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>

        <Box>
          {profileDetails && <ProfileDetail profile={profileDetails} />}
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProfilesPage;