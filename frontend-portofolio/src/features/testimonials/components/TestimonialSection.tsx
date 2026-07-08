import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Testimonial } from "../types";

export default function TestimonialSection({
  testimonials = [],
}: {
  testimonials?: Testimonial[];
}) {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // Create a large array to simulate infinite scroll seamlessly
  const displayItems = useMemo(() => {
    if (testimonials.length === 0) return [];
    // Tile 40 copies to ensure it rarely reaches the end during normal use
    return Array(40).fill(testimonials).flat();
  }, [testimonials]);

  // Start in the middle
  useEffect(() => {
    if (displayItems.length > 0) {
      setActiveIndex(Math.floor(displayItems.length / 2));
    }
  }, [displayItems.length]);

  // Auto-advance
  useEffect(() => {
    if (isHovered || displayItems.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, displayItems.length]);

  if (testimonials.length === 0) {
    return null; // Don't show if empty
  }

  const itemWidthStr = "var(--item-width)";
  const itemGapStr = "var(--item-gap)";
  // translation logic: (viewport / 2) - (itemWidth / 2) - (activeIndex * (itemWidth + itemGap))
  const xOffset = `calc(50vw - calc(${itemWidthStr} / 2) - calc(${activeIndex} * calc(${itemWidthStr} + ${itemGapStr})))`;

  return (
    <Box
      component="section"
      sx={{ py: 10, position: "relative", overflow: "hidden" }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: "40%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(25,118,210,0.05) 0%, rgba(0,0,0,0) 70%)",
          zIndex: 0,
          borderRadius: "50%",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, overflow: "visible" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            component="h2"
            fontWeight={800}
            textAlign="center"
            gutterBottom
            sx={{
              background: "linear-gradient(45deg, #1976d2, #9c27b0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            What People Say
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: "600px", mx: "auto" }}
          >
            Hear from the amazing people I've had the pleasure to work with.
          </Typography>
        </motion.div>
      </Container>

      {/* Slider Container */}
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          overflow: "hidden",
          py: 4,
          // Use CSS mask for perfectly blended transparent fading edges
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <Box
          sx={{
            "--item-width": "280px",
            "--item-gap": "16px",
            [theme.breakpoints.up("sm")]: {
              "--item-width": "400px",
              "--item-gap": "32px",
            },
            display: "flex",
            gap: "var(--item-gap)",
            width: "max-content",
            transform: `translateX(${xOffset})`,
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform",
          }}
        >
          {displayItems.map((t, i) => {
            const isActive = i === activeIndex;
            return (
              <Box
                key={`${t.id}-${i}`}
                onClick={() => setActiveIndex(i)}
                sx={{
                  width: "var(--item-width)",
                  flexShrink: 0,
                  cursor: "pointer",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isActive ? "scale(1)" : "scale(0.85)",
                  opacity: isActive ? 1 : 0.4,
                  "&:hover": {
                    opacity: isActive ? 1 : 0.7,
                  },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    background: isActive
                      ? "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)"
                      : "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                    backdropFilter: "blur(20px)",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.15)"
                      : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isActive
                      ? "0 20px 40px rgba(0,0,0,0.4)"
                      : "none",
                    "& .quote-icon": {
                      transform: isActive
                        ? "scale(1.1) rotate(-10deg)"
                        : "scale(1) rotate(-5deg)",
                      color: isActive
                        ? "rgba(156, 39, 176, 0.08)"
                        : "rgba(255,255,255,0.02)",
                    },
                  }}
                >
                  <FormatQuoteIcon
                    className="quote-icon"
                    sx={{
                      position: "absolute",
                      top: -20,
                      right: -10,
                      fontSize: 140,
                      color: "rgba(255,255,255,0.02)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      zIndex: 0,
                      transform: "rotate(-5deg)",
                    }}
                  />
                  <CardContent
                    sx={{
                      p: 4,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Rating
                      value={t.rating || 5}
                      readOnly
                      size="small"
                      sx={{
                        mb: 3,
                        color: "#ffb400",
                        "& .MuiRating-iconFilled": {
                          color: "#ffb400",
                        },
                      }}
                    />

                    <Typography
                      variant="body1"
                      sx={{
                        flexGrow: 1,
                        mb: 4,
                        fontStyle: "italic",
                        lineHeight: 1.8,
                        color: "text.secondary",
                        fontSize: "1.05rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      "{t.content}"
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={t.avatar_url || ""}
                        alt={t.name || "User"}
                        sx={{
                          width: 56,
                          height: 56,
                          border: "2px solid transparent",
                          background:
                            "linear-gradient(45deg, #1976d2, #9c27b0)",
                          backgroundClip: "padding-box",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          position: "relative",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            zIndex: -1,
                            margin: "-2px",
                            borderRadius: "inherit",
                            background:
                              "linear-gradient(45deg, #1976d2, #9c27b0)",
                          },
                        }}
                      >
                        {t.name ? t.name.charAt(0).toUpperCase() : "?"}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          color="text.primary"
                          noWrap
                        >
                          {t.name || "Anonymous"}
                        </Typography>
                        {(t.role || t.company) && (
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#ce93d8"
                                  : "#9c27b0",
                              fontWeight: 500,
                            }}
                            noWrap
                          >
                            {t.role} {t.role && t.company && "·"} {t.company}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
