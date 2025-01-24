import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const ResultsCard = ({ result }) => (
  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">{result.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {result.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <img src={result.imageUrl} alt="result" style={{ width: "100%" }} />
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export default ResultsCard;
