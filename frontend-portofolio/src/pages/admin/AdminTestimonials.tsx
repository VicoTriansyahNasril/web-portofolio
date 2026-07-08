import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { testimonialApi } from "@/features/testimonials/api/testimonialApi";
import { Testimonial, TestimonialInput } from "@/features/testimonials/types";
import TestimonialFormModal from "@/features/testimonials/components/TestimonialFormModal";
import SortableList from "@/components/ui/SortableList";
import { confirm, alert } from "@/utils/confirm";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);

  const loadTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testimonialApi.getAdmin();
      setTestimonials(data || []);
    } catch {
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTestimonials();
  }, []);

  const handleOpenModal = (testimonial: Testimonial | null = null) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setEditingTestimonial(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    const res = await confirm({
      title: `Delete testimonial from "${testimonial.name}"?`,
    });
    if (res.isConfirmed) {
      try {
        await testimonialApi.delete(testimonial.id);
        await alert({
          title: "Success",
          text: "Testimonial deleted successfully.",
        });
        await loadTestimonials();
      } catch {
        await alert({
          title: "Error",
          icon: "error",
          text: "Failed to delete testimonial.",
        });
      }
    }
  };

  const handleSubmit = async (values: TestimonialInput) => {
    try {
      if (editingTestimonial) {
        await testimonialApi.update(editingTestimonial.id, values);
      } else {
        await testimonialApi.create(values);
      }
      handleCloseModal();
      await alert({
        title: "Success",
        text: "Testimonial saved successfully.",
      });
      await loadTestimonials();
    } catch {
      await alert({
        title: "Error",
        icon: "error",
        text: "Failed to save testimonial.",
      });
    }
  };

  const handleReorder = async (newOrder: Testimonial[]) => {
    setTestimonials(newOrder);
    try {
      const payload = newOrder.map((item, index) => ({
        id: item.id,
        sort_order: index,
      }));
      await testimonialApi.reorder(payload);
    } catch {
      await alert({
        title: "Error",
        icon: "error",
        text: "Failed to save order.",
      });
      await loadTestimonials();
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 980, mx: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" fontWeight={800}>
          Manage Testimonials
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => handleOpenModal()}
        >
          Add Testimonial
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SortableList
        items={testimonials}
        getId={(s) => s.id}
        onReorder={handleReorder}
        onEdit={handleOpenModal}
        onDelete={(s) => void handleDelete(s)}
        renderItem={(testimonial) => (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={testimonial.avatar_url || undefined}
              alt={testimonial.name}
            />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {testimonial.name}{" "}
                {!testimonial.is_visible && (
                  <Typography component="span" color="error.main" fontSize={12}>
                    (Hidden)
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testimonial.role}{" "}
                {testimonial.company && `@ ${testimonial.company}`}
              </Typography>
            </Box>
          </Stack>
        )}
      />

      <TestimonialFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingTestimonial}
      />
    </Box>
  );
}
