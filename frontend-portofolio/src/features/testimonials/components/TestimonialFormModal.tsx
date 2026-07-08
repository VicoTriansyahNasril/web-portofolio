import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Rating,
  Box,
  Typography,
} from "@mui/material";
import { Testimonial, TestimonialInput } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TestimonialInput) => void;
  initialData: Testimonial | null;
}

export default function TestimonialFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setRole(initialData?.role || "");
      setCompany(initialData?.company || "");
      setAvatarUrl(initialData?.avatar_url || "");
      setContent(initialData?.content || "");
      setRating(initialData ? initialData.rating : 5);
      setIsVisible(initialData ? initialData.is_visible : true);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      role,
      company,
      avatar_url: avatarUrl,
      content,
      rating: rating || 5,
      is_visible: isVisible,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? "Edit Testimonial" : "Add Testimonial"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              required
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Role"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. CEO, Tech Lead"
            />
            <TextField
              label="Company"
              fullWidth
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Apple"
            />
            <TextField
              label="Avatar URL"
              fullWidth
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
            <TextField
              required
              label="Content / Review"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                />
              }
              label="Visible to Public"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
