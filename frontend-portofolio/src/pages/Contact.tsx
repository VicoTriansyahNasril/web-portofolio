import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async () => {
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      console.error(error);
    }
  };

  return (
    <section id="contact" className="py-20 relative z-10">
      <div className="max-w-3xl mx-auto px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-display text-4xl md:text-5xl font-bold mb-4 dark:text-white text-gray-900 inline-block border-b-2 border-primary-500 pb-2">
            Get In Touch
          </h2>
          <p className="dark:text-gray-400 text-gray-600 text-lg">
            Have a question or want to work together? Let's connect.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-heavy p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit();
              }}
              className="relative z-10 flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold dark:text-gray-300 text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full dark:bg-black/20 bg-white/50 dark:border-white/10 border-black/10 border rounded-xl px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold dark:text-gray-300 text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full dark:bg-black/20 bg-white/50 dark:border-white/10 border-black/10 border rounded-xl px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold dark:text-gray-300 text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full dark:bg-black/20 bg-white/50 dark:border-white/10 border-black/10 border rounded-xl px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-500 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-4 w-full md:w-auto md:self-end px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <p className="text-green-600 dark:text-green-400 text-sm text-center mt-2 font-medium">
                  Your message has been sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 dark:text-red-400 text-sm text-center mt-2 font-medium">
                  Something went wrong. Please try again later.
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
