import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Project, UpdateProjectDTO } from "@/features/projects/types";
import { slugify, isValidSlug } from "@/utils/slugify";
import { uploadFile } from "@/api/upload";
import { alert } from "@/utils/confirm";

interface UseProjectFormProps {
  initialData?: Partial<Project> | null;
  onSubmit: (data: UpdateProjectDTO) => Promise<void>;
}

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toISOString().split("T")[0] : "";

export function useProjectForm({ initialData, onSubmit }: UseProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    role: "",
    summary: "",
    body: "",
    tech_stack: "",
    demo_url: "",
    repo_url: "",
    cover_url: "",
    start_date: "",
    end_date: "",
    is_featured: false,
    status: "draft" as "draft" | "published",
  });

  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        role: initialData.role || "",
        summary: initialData.summary || "",
        body: initialData.body || "",
        tech_stack: initialData.tech_stack || "",
        demo_url: initialData.demo_url || "",
        repo_url: initialData.repo_url || "",
        cover_url: initialData.cover_url || "",
        start_date: formatDate(initialData.start_date),
        end_date: formatDate(initialData.end_date),
        is_featured: initialData.is_featured || false,
        status: initialData.status || "draft",
      });
      if (Array.isArray(initialData.gallery)) {
        setGallery(initialData.gallery);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "title" && !initialData?.id) {
      const genSlug = slugify(value);
      setFormData((prev) => ({ ...prev, slug: genSlug }));
      validateSlug(genSlug);
    }
    if (name === "slug") validateSlug(value);
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const validateSlug = (val: string) => {
    if (!val) setSlugError("Slug required");
    else if (!isValidSlug(val)) setSlugError("Invalid format");
    else setSlugError("");
  };

  const handleUploadGallery = async (files: FileList | null) => {
    if (!files?.length) return;
    setLoading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadFile));
      setGallery((prev) => [...prev, ...urls]);
    } catch (error) {
      console.error(error);
      alert({
        title: "Error",
        text: "Failed to upload images.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert({
        title: "Validation Error",
        text: "Title is required.",
        icon: "warning",
      });
      return;
    }
    if (!formData.slug.trim() || slugError) {
      alert({
        title: "Validation Error",
        text: "Valid Slug is required.",
        icon: "warning",
      });
      return;
    }
    if (!formData.summary.trim()) {
      alert({
        title: "Validation Error",
        text: "Summary is required.",
        icon: "warning",
      });
      return;
    }
    if (!formData.start_date) {
      alert({
        title: "Validation Error",
        text: "Start Date is required.",
        icon: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date
          ? new Date(formData.end_date).toISOString()
          : "",
        gallery,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    gallery,
    setGallery,
    loading,
    setLoading,
    slugError,
    handleChange,
    handleCheckbox,
    handleUploadGallery,
    submit,
  };
}
