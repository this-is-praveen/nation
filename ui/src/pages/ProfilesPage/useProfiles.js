import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProfiles = () => {
  const [selectedProfile, setSelectedProfile] = useState('');

  const {
    data: profilesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ['profiles'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get('http://localhost:5000/list-documents', {
        params: {
          page: pageParam,
          page_size: 20
        }
      });
      return data;
    },
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
  });

  const { data: profileDetails } = useQuery({
    queryKey: ['profile', selectedProfile],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/get-document/${selectedProfile}`
      );
      return data;
    },
    enabled: !!selectedProfile
  });

  return {
    profiles: profilesData?.pages.flatMap(page => page.profiles) || [],
    profileDetails,
    selectedProfile,
    setSelectedProfile,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    isError
  };
};