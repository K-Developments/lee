
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import type { AboutContent } from "@/services/firestore";

type Panel = "faq" | "testimonials" | "solutions";

interface PanelData {
    title: string;
    imageUrl: string;
    aiHint: string;
    link: string;
    content: {
      title: string;
      text: string;
    };
}

const getPanelData = (content: AboutContent['interactivePanels'] | null): Record<Panel, PanelData> | null => {
    if (!content) return null;
    return {
      faq: {
        title: "FAQs",
        imageUrl: content.faq.imageUrl,
        aiHint: content.faq.imageHint,
        link: content.faq.link,
        content: {
          title: content.faq.title,
          text: content.faq.description,
        },
      },
      testimonials: {
        title: "Testimonials",
        imageUrl: content.testimonials.imageUrl,
        aiHint: content.testimonials.imageHint,
        link: content.testimonials.link,
        content: {
          title: content.testimonials.title,
          text: content.testimonials.description,
        },
      },
      solutions: {
        title: "Solutions",
        imageUrl: content.solutions.imageUrl,
        aiHint: content.solutions.imageHint,
        link: content.solutions.link,
        content: {
          title: content.solutions.title,
          text: content.solutions.description,
        },
      },
    };
};


export function InteractivePanels({ content }: { content: AboutContent | null }) {
  const [activePanel, setActivePanel] = useState<Panel>('faq');
  const [hoveredPanel, setHoveredPanel] = useState<Panel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [panelData, setPanelData] = useState<Record<Panel, PanelData> | null>(null);

  useEffect(() => {
      if (content) {
          setPanelData(getPanelData(content.interactivePanels));
          setIsLoading(false);
      }
  }, [content]);

  const handlePanelClick = (panel: Panel) => {
    setActivePanel(panel);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    // No-op to prevent closing the active panel
  };

  if (isLoading || !panelData) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex flex-col md:flex-row md:h-[500px] overflow-hidden border border-gray-200 shadow-lg">
                <Skeleton className="w-full h-48 md:h-auto" />
                <Skeleton className="w-full h-48 md:h-auto" />
                <Skeleton className="w-full h-48 md:h-auto" />
            </div>
        </div>
    );
  }

  const panels = Object.keys(panelData) as Panel[];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row md:h-[500px] overflow-hidden border border-gray-200 shadow-lg">
        {panels.map((panelId) => {
          const isActive = activePanel === panelId;
          const isInactive = activePanel !== null && !isActive;
          const isHovered = hoveredPanel === panelId && !isActive;

          return (
            <motion.div
              key={panelId}
              layout
              onClick={() => handlePanelClick(panelId)}
              onHoverStart={() => setHoveredPanel(panelId)}
              onHoverEnd={() => setHoveredPanel(null)}
              className={cn(
                "relative overflow-hidden cursor-pointer h-48 md:h-auto border-b md:border-b-0 md:border-r border-gray-200 last:border-b-0 last:md:border-r-0",
                isActive && "z-10"
              )}
              style={{
                flexBasis: isInactive ? "10%" : isActive ? "70%" : "33.33%",
                flexGrow: isInactive ? 0.001 : isActive ? 1 : 0.5,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1 }}
                animate={{
                  scale: isActive ? 1.05 : isHovered ? 1.03 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                <Image
                  src={panelData[panelId].imageUrl}
                  alt={panelData[panelId].title}
                  fill
                  className="object-cover"
                  data-ai-hint={panelData[panelId].aiHint}
                  priority
                />
              </motion.div>

              <div className="absolute inset-0 bg-black/50" />

              <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                <AnimatePresence>
                  {!activePanel && (
                    <motion.h3
                      initial={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold"
                    >
                      {panelData[panelId].title}
                    </motion.h3>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isInactive && (
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold [writing-mode:vertical-rl] rotate-180"
                    >
                      {panelData[panelId].title}
                    </motion.h3>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: 0.2,
                      }}
                      className="space-y-6"
                    >
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-bold max-w-lg"
                      >
                        {panelData[panelId].content.title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg max-w-2xl text-white/90"
                      >
                        {panelData[panelId].content.text}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                         <Button asChild variant="default" size="lg">
                          <Link href={panelData[panelId].link}>Learn more</Link>
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
