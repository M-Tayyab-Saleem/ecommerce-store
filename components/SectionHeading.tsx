"use client";

import React from "react";

interface SectionHeadingProps {
    label?: string;
    title: string;
    subtitle?: string;
    align?: "left" | "center";
    className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
    label,
    title,
    subtitle,
    align = "center",
    className = "",
}) => {
    const alignmentClasses = align === "center" ? "text-center" : "text-left";

    return (
        <div className={`mb-10 md:mb-12 ${alignmentClasses} ${className}`}>
            {label && (
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2 block">
                    {label}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
            {subtitle && (
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{subtitle}</p>
            )}
        </div>
    );
};

export default SectionHeading;
