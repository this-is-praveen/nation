import { useState } from "react";
import { motion } from "framer-motion";
import { TextField, Button, Box, Typography, Chip, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getPreferredLabeledData } from "../constants";

export const SetupPage = () => {
  const [input, setInput] = useState("");
  const [labels, setLabels] = useState(getPreferredLabeledData());

  const handleAdd = () => {
    if (input.trim()) {
      setLabels([...labels, input.trim()]);
      setInput("");
    }
  };

  const handleSave = () => {
    sessionStorage.setItem("labels", JSON.stringify(labels));
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      style={{ padding: "2rem" }}
    >
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Label Configuration
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              label="New Label"
              variant="outlined"
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button
              variant="contained"
              onClick={handleAdd}
              startIcon={<AddIcon />}
              sx={{ minWidth: 120 }}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {labels.map((label, index) => (
              <Chip
                key={index}
                label={label}
                onDelete={() => setLabels(labels.filter((_, i) => i !== index))}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        </Paper>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!labels.length}
          sx={{ minWidth: 120 }}
        >
          Save Configuration
        </Button>
      </Box>
    </motion.div>
  );
};
