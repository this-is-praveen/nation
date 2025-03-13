import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../utils/apiClient";

const AIChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mutation to call the AI response API
  const mutation = useMutation({
    mutationFn: (userMessage) => {
      // Retrieve developer-specific instructions from sessionStorage (stored as JSON)
      const instructions = JSON.parse(
        sessionStorage.getItem("ai_instructions") || "[]"
      );
      return axiosClient.post("/generate-ai-response", {
        message: userMessage,
        instructions,
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

      {/* Conversation container */}
      <Paper sx={{ flex: 1, p: 2, overflowY: "auto", mb: 2 }}>
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
                    msg.sender === "user" ? "primary.light" : "grey.100",
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
            disabled={mutation.isLoading}
          >
            Send
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AIChatPage;
