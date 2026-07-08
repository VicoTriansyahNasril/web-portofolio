import { api } from "@/lib/axios";
import { Testimonial, TestimonialInput } from "../types";

export const testimonialApi = {
  getPublic: async () => {
    const response = await api.get<{ data: Testimonial[] }>(
      "/api/testimonials",
    );
    return response.data.data;
  },

  getAdmin: async () => {
    const response = await api.get<{ data: Testimonial[] }>(
      "/api/admin/testimonials",
    );
    return response.data.data;
  },

  create: async (data: TestimonialInput) => {
    const response = await api.post("/api/admin/testimonials", data);
    return response.data;
  },

  update: async (id: number, data: TestimonialInput) => {
    const response = await api.put(`/api/admin/testimonials/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/admin/testimonials/${id}`);
    return response.data;
  },

  reorder: async (orders: { id: number; sort_order: number }[]) => {
    const response = await api.post("/api/admin/testimonials/reorder", {
      orders,
    });
    return response.data;
  },
};
