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
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import TiltedCard from "../../assets/TiltedCard";

const fetchDocuments = async ({ pageParam = 1, queryKey }) => {
  const [, { searchQuery }] = queryKey;
  const { data } = await axios.get("http://localhost:5000/list-documents", {
    params: {
      page: pageParam,
      page_size: 10,
      name: searchQuery,
    },
  });
  return data;
};

const fetchDocumentDetails = async (docId) => {
  const { data } = await axios.get(
    `http://localhost:5000/get-document/${docId}?include_embeddings=false`
  );
  return data;
};

const DocumentsPage = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { ref, inView } = useInView();

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Documents query
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

  // Document details query
  const { data: docDetails } = useQuery({
    queryKey: ["document", selectedDoc],
    queryFn: () => fetchDocumentDetails(selectedDoc),
    enabled: !!selectedDoc,
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

  const flatDocuments =
    documents?.pages.flatMap((page) => page.documents) || [];

  return (
    <Grid2
      container
      spacing={4}
      className="xxxxxxxxxxxxxxxx"
      sx={{ p: 4, maxHeight: "calc(100vh - 180px)" }}
    >
      {/* Left Column - Document List */}
      <Grid2 item xs={12} md={5} sx={{ maxHeight: "calc(100vh - 180px)" }}>
        <Box sx={{ height: "calc(100vh - 180px)" }}>
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

          <Box
            sx={{
              height: "calc(100% - 125px)",
              overflow: "auto",
              pr: 2,
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "primary.main",
                borderRadius: "4px",
              },
            }}
          >
            {flatDocuments.map((doc, index) => {
              return (
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
                      cursor: "pointer",
                      transition: "0.3s",
                      backgroundColor:
                        selectedDoc === doc.id
                          ? "primary.main"
                          : "background.paper",
                      "&:hover": {
                        transform: "translateX(5px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "secondary.main" }}>
                        {doc.name[0]}
                      </Avatar>
                      <Typography variant="h6">{doc.name}</Typography>
                    </Box>
                  </Paper>
                </motion.div>
              );
            })}

            {(isFetchingNextPage || isLoading) && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            <div ref={ref} />
          </Box>
        </Box>
      </Grid2>

      <Grid2 item xs={12} md={7}>
        <Box
          sx={{
            position: "sticky",
            top: 20,
            height: "calc(100vh - 200px)",
            overflow: "auto",
          }}
        >
          {docDetails && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                {docDetails.mediaDetails?.imageUrl && (
                  <Box
                    sx={{
                      mb: 4,
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: 4,
                    }}
                  >
                    <TiltedCard
                      imageSrc={docDetails.mediaDetails.imageUrl}
                      altText={docDetails.name}
                      showTooltip={false}
                      containerHeight="300px"
                      containerWidth="auto"
                    />
                  </Box>
                )}

                <Box
                  sx={{
                    display: "Grid2",
                    gap: 2,
                    p: 3,
                    bgcolor: "background.default",
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h4">{docDetails.name}</Typography>

                  <Box sx={{ display: "flex", gap: 4 }}>
                    <Box>
                      <Typography variant="overline">Document ID</Typography>
                      <Typography variant="body1">{docDetails._id}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="overline">Last Updated</Typography>
                      <Typography variant="body1">
                        {new Date(docDetails.updatedDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          )}
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default DocumentsPage;
