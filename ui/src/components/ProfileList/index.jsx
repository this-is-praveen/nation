import { useEffect } from "react";
import { List, CircularProgress, Box, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { ProfileItem } from "./ProfileItem";

export const ProfileList = ({
  profiles,
  loading,
  hasMore,
  onLoadMore,
  onSelect,
  selectedProfile,
}) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading]);

  console.log('profiles :>> ', profiles);

  return (
    <List sx={{ width: "100%" }}>
      {profiles?.map((profile) => {
        console.log('profile :>> ', profile);
        return (
          <ProfileItem
            key={profile.id}
            profile={profile}
            onSelect={onSelect}
            selected={selectedProfile === profile.id}
          />
        );
      })}

      {hasMore && (
        <Box
          ref={ref}
          sx={{ display: "flex", justifyContent: "center", py: 4 }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && profiles?.length === 0 && (
        <Typography sx={{ textAlign: "center", py: 4 }}>
          No profiles found
        </Typography>
      )}
    </List>
  );
};
