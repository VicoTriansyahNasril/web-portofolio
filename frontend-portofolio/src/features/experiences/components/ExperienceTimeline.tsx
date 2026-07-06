import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Experience } from "../types";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

const getTypeIcon = (type: string) => {
  if (type === "Pekerjaan Penuh Waktu" || type === "Magang")
    return <WorkIcon sx={{ fontSize: "1rem" }} />;
  if (type === "Organisasi") return <GroupsIcon sx={{ fontSize: "1rem" }} />;
  if (type === "Pendidikan") return <SchoolIcon sx={{ fontSize: "1rem" }} />;
  return <WorkIcon sx={{ fontSize: "1rem" }} />;
};

const getTypeColorClass = (type: string) => {
  if (type === "Pekerjaan Penuh Waktu") return "bg-primary-500 text-white";
  if (type === "Magang") return "bg-blue-500 text-white";
  if (type === "Organisasi") return "bg-purple-500 text-white";
  if (type === "Pendidikan") return "bg-emerald-500 text-white";
  return "bg-primary-500 text-white";
};

const getDotColorClass = (type: string) => {
  if (type === "Pekerjaan Penuh Waktu")
    return "bg-primary-500 shadow-[0_0_0_4px_rgba(6,182,212,0.2)]";
  if (type === "Magang")
    return "bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]";
  if (type === "Organisasi")
    return "bg-purple-500 shadow-[0_0_0_4px_rgba(168,85,247,0.2)]";
  if (type === "Pendidikan")
    return "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]";
  return "bg-primary-500 shadow-[0_0_0_4px_rgba(6,182,212,0.2)]";
};

export default function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  const formatDate = (date: string | null): string => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
    });
  };

  const sortedExperiences = [...experiences].sort((a, b) => {
    const aDate = new Date(a.start_date);
    const bDate = new Date(b.start_date);
    return bDate.getTime() - aDate.getTime();
  });

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Belum ada data pengalaman</p>
      </div>
    );
  }

  return (
    <div className="relative py-8 overflow-hidden">
      {/* Desktop Center Line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-white/10 -translate-x-1/2 z-0" />

      {/* Mobile Left Line */}
      <div className="md:hidden absolute left-4 top-8 bottom-8 w-[2px] bg-gray-200 dark:bg-white/10 z-0" />

      <div className="flex flex-col space-y-12 md:space-y-0">
        {sortedExperiences.map((exp, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={exp.id}
              className={`flex relative w-full md:mb-16 ${
                isEven ? "md:justify-end" : "md:justify-start"
              } justify-start pl-12 md:pl-0`}
            >
              {/* Dot Timeline */}
              <div className="absolute left-4 md:left-1/2 top-8 md:top-1/2 -translate-x-[9px] md:-translate-x-1/2 md:-translate-y-1/2 z-10 bg-white dark:bg-[#050505] p-1 rounded-full border-2 border-gray-200 dark:border-white/10">
                <div
                  className={`w-4 h-4 rounded-full ${getDotColorClass(exp.type)}`}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full md:w-1/2 ${
                  isEven ? "md:pl-12 lg:pl-16" : "md:pr-12 lg:pr-16"
                } relative`}
              >
                <div className="glass-heavy p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary-500/50 group">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 leading-tight group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                        {exp.title}
                      </h3>
                      <h4 className="text-primary-600 dark:text-primary-500 font-semibold text-lg">
                        {exp.entity_name}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-sm">
                        <CalendarTodayIcon sx={{ fontSize: "1rem" }} />
                        <span>{`${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-sm ${getTypeColorClass(exp.type)}`}
                      >
                        {getTypeIcon(exp.type)}
                        <span>{exp.type}</span>
                      </div>

                      {exp.location && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-sm">
                          <LocationOnIcon sx={{ fontSize: "1rem" }} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-gray-700 dark:text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap mt-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
