"use client";

import { Eye, Brain, Headphones, Languages } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Dyslexia-Friendly",
    description: "Optimized fonts and spacing for easier reading",
  },
  {
    icon: Brain,
    title: "Cognitive Support",
    description: "Simplify complex text to any reading level",
  },
  {
    icon: Headphones,
    title: "Text-to-Speech",
    description: "Listen to content with built-in voice synthesis",
  },
  {
    icon: Languages,
    title: "Multiple Formats",
    description: "Get output as bullets, steps, or paragraphs",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-8" aria-labelledby="features-heading">
      <h2 id="features-heading" className="sr-only">Accessibility Features</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <feature.icon
                className="w-5 h-5 text-primary"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
