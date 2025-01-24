import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import DatasetSelector from "../components/DatasetSelector";
import ResultsCard from "../components/ResultsCard";

const SearchPage = () => {
  const [dataset, setDataset] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!dataset) return alert("Please select a dataset!");
    setLoading(true);
    try {
      const response = await axios.post("/api/search", { dataset });
      setResults(response.data); // Assuming your API returns related info
    } catch (error) {
      console.error("Error fetching results:", error);
      alert("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mt: 4 }}
        >
          Mist
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          Search with Embeddings
        </Typography>
        <Box sx={{ my: 4 }}>
          <DatasetSelector dataset={dataset} setDataset={setDataset} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
            sx={{ mt: 2 }}
          >
            Search
          </Button>
        </Box>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography align="center">Loading...</Typography>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {results.map((result, idx) => (
            <ResultsCard key={idx} result={result} />
          ))}
        </motion.div>
      )}
    </Container>
  );
};

export default SearchPage;
