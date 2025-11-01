// portofolio/frontend-portofolio/src/components/ui/InteractiveBackground.tsx
import { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useTheme } from "@mui/material/styles";
import type { Engine, ISourceOptions } from "tsparticles-engine";

export default function InteractiveBackground() {
    const theme = useTheme();

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const options: ISourceOptions = useMemo(() => {
        const isDark = theme.palette.mode === 'dark';
        const particleColors = isDark 
            ? [theme.palette.primary.light, theme.palette.secondary.light, "#ffffff"] 
            : [theme.palette.primary.dark, theme.palette.secondary.dark, "#475569"];
        const linkColor = isDark ? "#ffffff" : "#475569";

        return {
            background: {
                color: { value: "transparent" },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repel",
                    },
                    resize: true,
                },
                modes: {
                    repel: {
                        distance: 100,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: particleColors,
                },
                links: {
                    color: linkColor,
                    distance: 150,
                    enable: true,
                    opacity: isDark ? 0.1 : 0.2,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "bounce" },
                    random: true,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: isDark ? 80 : 100,
                },
                opacity: {
                    value: isDark ? 0.3 : 0.5,
                    animation: {
                        enable: true,
                        speed: 0.5,
                        minimumValue: 0.1,
                        sync: false,
                    },
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 2.5 },
                    animation: {
                        enable: true,
                        speed: 2,
                        minimumValue: 0.5,
                        sync: false,
                    },
                },
            },
            detectRetina: true,
        };
    }, [theme.palette.mode, theme.palette.primary, theme.palette.secondary]);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={options}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'auto',
            }}
        />
    );
}