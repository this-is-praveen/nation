import { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Box,
  TextField,
  CircularProgress,
  Alert,
  Grid2,
  Paper,
  Typography,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import TiltedCard from "../../assets/TiltedCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axiosClient from "../../utils/apiClient";

const fetchDocuments = async ({ pageParam = 1, queryKey }) => {
  const [, { searchQuery }] = queryKey;
  const { data } = await axiosClient.get("list-documents", {
    params: {
      page: pageParam,
      page_size: 10,
      name: searchQuery,
    },
  });
  return data;
};

const fetchDocumentDetails = async (docId) => {
  const { data } = await axiosClient.get(`get-document/${docId}?include_embeddings=false`
  );
  return data;
};

const fetchMetaInfo = async (docId) => {
  const { data } = await axiosClient.post('get-meta-info', {
    id: docId,
    labels: JSON.parse(sessionStorage.getItem("labels") || "[]")
  });
  const sorted = data.meta_info.sort((a, b) => b.similarity_score - a.similarity_score);
  return sorted.filter(item => item.similarity_score > 20);
};

const DocumentsPage = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { ref, inView } = useInView();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: documents,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["documents", { searchQuery: debouncedQuery }],
    queryFn: fetchDocuments,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const { data: docDetails } = useQuery({
    queryKey: ["document", selectedDoc],
    queryFn: () => fetchDocumentDetails(selectedDoc),
    enabled: !!selectedDoc,
  });

  const { data: metaInfo, isLoading: metaLoading, error: metaError } = useQuery({
    queryKey: ['metaInfo', selectedDoc],
    queryFn: () => fetchMetaInfo(selectedDoc),
    enabled: !!selectedDoc && !!sessionStorage.getItem("labels"),
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

  const flatDocuments = documents?.pages.flatMap((page) => page.documents) || [];
  const topResult = metaInfo?.[0];

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 128px)', p: 3, gap: 3, width: "80vw" }}>
      <Box sx={{ width: '30%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Documents"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
        />

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading documents
          </Alert>
        )}

        <Box sx={{
          flex: 1,
          overflow: 'auto',
          pr: 2,
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'primary.main',
            borderRadius: '4px',
          },
        }}>
          {flatDocuments.map((doc, index) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Paper
                elevation={2}
                onClick={() => setSelectedDoc(doc.id)}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  transition: '0.3s',
                  backgroundColor: selectedDoc === doc.id ? 'primary.main' : 'background.paper',
                  '&:hover': { transform: 'translateX(5px)', boxShadow: 4 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>{doc.name[0]}</Avatar>
                  <Typography variant="h6">{doc.name}</Typography>
                </Box>
              </Paper>
            </motion.div>
          ))}

          {(isFetchingNextPage || isLoading) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <div ref={ref} />
        </Box>
      </Box>

      {/* Right Section - Details & Analysis */}
      <Box sx={{ flex: 1, display: 'flex', gap: 3, height: '100%' }}>
        {/* Document Details */}
        <Box sx={{ width: '50%', height: '100%' }}>
          {docDetails && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ height: '100%' }}
            >
              <Paper elevation={4} sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                {docDetails.mediaDetails?.imageUrl && (
                  <Box sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                    <TiltedCard
                      imageSrc={docDetails.mediaDetails.imageUrl}
                      altText={docDetails.name}
                      containerHeight="300px"
                    />
                  </Box>
                )}

                <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 3 }}>
                  <Typography variant="h4" gutterBottom>{docDetails.name}</Typography>
                  <Grid2 container spacing={2}>
                    <Grid2 item xs={6}>
                      <Typography variant="overline">Document ID</Typography>
                      <Typography>{docDetails._id}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                      <Typography variant="overline">Last Updated</Typography>
                      <Typography>
                        {new Date(docDetails.updatedDate).toLocaleDateString()}
                      </Typography>
                    </Grid2>
                  </Grid2>
                </Box>
              </Paper>
            </motion.div>
          )}
        </Box>

        {/* Meta Info Analysis */}
        <Box sx={{ width: '50%', height: '100%' }}>
          {metaInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ height: '100%' }}
            >
              <Paper elevation={4} sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  Semantic Analysis
                </Typography>

                {metaError && <Alert severity="error" sx={{ mb: 2 }}>Error loading data</Alert>}

                {metaLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {topResult && (
                      <Stack spacing={2} sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 3 }}>
                        <Typography variant="h6" color="primary">Best Match 🎯</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            label={`${topResult.similarity_score}%`}
                            color="success"
                            sx={{ fontSize: '1.2rem', px: 2 }}
                          />
                          <Typography variant="h5">{topResult.label}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Distance: {topResult.distance.toFixed(2)}
                        </Typography>
                      </Stack>
                    )}

                    <Box sx={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={metaInfo}
                          layout="vertical"
                          margin={{ left: 30, right: 20 }}
                        >
                          <XAxis
                            type="number"
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                            label={{ value: 'Similarity Score', position: 'bottom' }}
                          />
                          <YAxis
                            type="category"
                            dataKey="label"
                            width={150}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value) => [`${value}%`, 'Similarity']}
                            contentStyle={{ borderRadius: 8 }}
                          />
                          <Bar
                            dataKey="similarity_score"
                            fill="#1AA6B4"
                            radius={[0, 4, 4, 0]}
                            animationDuration={800}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </>
                )}
              </Paper>
            </motion.div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentsPage;