"use client"

import { useTheme, type ThemeInfo } from "@/components/theme-provider"
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

function ThemeCard({ themeInfo }: { themeInfo: ThemeInfo }) {
    const { theme, setTheme } = useTheme()
    const isActive = theme === themeInfo.name

    return (
        <button
            type="button"
            id={`theme-card-${themeInfo.name}`}
            onClick={() => setTheme(themeInfo.name)}
            className={`
                relative group rounded-xl border-2 p-4 text-left transition-all duration-200
                hover:shadow-lg hover:scale-[1.02] cursor-pointer
                ${isActive
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-border hover:border-primary/40"
                }
            `}
        >
            {/* Active checkmark */}
            {isActive && (
                <div className="absolute top-3 right-3 size-6 rounded-full bg-primary flex items-center justify-center">
                    <CheckIcon className="size-3.5 text-primary-foreground" />
                </div>
            )}

            {/* Color swatches */}
            <div className="flex gap-1.5 mb-3">
                <div
                    className="size-8 rounded-lg shadow-sm border border-black/10"
                    style={{ backgroundColor: themeInfo.colors.background }}
                    title="Background"
                />
                <div
                    className="size-8 rounded-lg shadow-sm border border-black/10"
                    style={{ backgroundColor: themeInfo.colors.primary }}
                    title="Primary"
                />
                <div
                    className="size-8 rounded-lg shadow-sm border border-black/10"
                    style={{ backgroundColor: themeInfo.colors.secondary }}
                    title="Secondary"
                />
                <div
                    className="size-8 rounded-lg shadow-sm border border-black/10"
                    style={{ backgroundColor: themeInfo.colors.accent }}
                    title="Accent"
                />
            </div>

            {/* Theme name + mode badge */}
            <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">
                    {themeInfo.label}
                </span>
                {themeInfo.isDark ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                        <MoonIcon className="size-3" />
                        Dark
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                        <SunIcon className="size-3" />
                        Light
                    </span>
                )}
            </div>
        </button>
    )
}

export default function SettingsPage() {
    const { themes, theme } = useTheme()

    const lightThemes = themes.filter((t) => !t.isDark)
    const darkThemes = themes.filter((t) => t.isDark)

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Customize your NodeFlow experience
                </p>
            </div>

            {/* Appearance section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <MonitorIcon className="size-5 text-primary" />
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Appearance
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Choose a color theme for the interface
                        </p>
                    </div>
                </div>

                {/* Current theme indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="size-3 rounded-full bg-primary" />
                    <span>
                        Active theme:{" "}
                        <span className="font-medium text-foreground capitalize">
                            {theme}
                        </span>
                    </span>
                </div>

                {/* Light themes */}
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <SunIcon className="size-4" />
                        Light Themes
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {lightThemes.map((t) => (
                            <ThemeCard key={t.name} themeInfo={t} />
                        ))}
                    </div>
                </div>

                {/* Dark themes */}
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        <MoonIcon className="size-4" />
                        Dark Themes
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {darkThemes.map((t) => (
                            <ThemeCard key={t.name} themeInfo={t} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
