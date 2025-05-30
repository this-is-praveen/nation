import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosClient from "../../utils/apiClient";

const endPoint =
  "http://127.0.0.1:5000" || "https://348a-194-195-115-244.ngrok-free.app";
const AIChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedInstruction, setSelectedInstruction] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchInstructions = async () => {
    const { data } = await axiosClient.get(
      `${endPoint}/instructions?page=1&page_size=10`
    );
    return data;
  };

  const { data: instructionOptions } = useQuery({
    queryKey: ["instruction"],
    queryFn: () => fetchInstructions(),
  });

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mutation to call the AI response API
  const mutation = useMutation({
    mutationFn: (userMessage) => {
      // Retrieve developer-specific instructions from sessionStorage (stored as JSON)
      // const instructions = JSON.parse(
      //   sessionStorage.getItem("ai_instructions") || "[]"
      // );
      return axiosClient.post(`${endPoint}/ai/completions`, {
        user_prompt: userMessage,
        instruction_id: selectedInstruction,
        model: "gpt-4o",
      });
    },
    onSuccess: (response) => {
      // Append AI response to messages list
      if (response.data) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: response.data.response },
        ]);
      }
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to the conversation
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // Send the message to the API
    mutation.mutate(input);

    // Clear the input field
    setInput("");
  };

  return (
    <Box
      sx={{
        p: 3,
        height: "calc(100vh - 128px)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
        DevAssist Chat
      </Typography>

      <Paper sx={{ flex: 1, p: 2, overflowY: "auto", mb: 2 }}>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="instruction-select-label">Instruction</InputLabel>
            <Select
              labelId="instruction-select-label"
              id="instruction-select"
              value={selectedInstruction || ""}
              onChange={(e) => {
                console.log("selected option:", e.target.value);
                setSelectedInstruction(e.target.value);
              }}
              label="Instruction"
              variant="outlined"
            >
              {instructionOptions?.instructions?.length > 0 ? (
                instructionOptions.instructions.map((_option, index) => (
                  <MenuItem key={index} value={_option.id}>
                    {_option.technology}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No options available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
        <Stack spacing={2}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Paper
                sx={{
                  p: 2,
                  backgroundColor:
                    msg.sender === "user" ? "primary.light" : "grey.700",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: msg.sender === "ai" ? "monospace" : "inherit",
                  }}
                >
                  {msg.text}
                </Typography>
                <Typography variant="caption" sx={{ float: "right" }}>
                  {msg.sender === "user" ? "You" : "DevAssist"}
                </Typography>
              </Paper>
            </motion.div>
          ))}
          {mutation.isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {mutation.error && (
            <Alert severity="error">
              {mutation.error.response?.data?.message ||
                "Error generating response"}
            </Alert>
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      {/* Chat input area */}
      <form onSubmit={handleSend}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me anything about your code..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={mutation.isLoading || !selectedInstruction}
          >
            Send
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AIChatPage;
