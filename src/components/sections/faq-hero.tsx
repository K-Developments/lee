
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFaqContent, FaqContent } from "@/services/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export function FaqHero() {
  const [content, setContent] = useState<FaqContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const faqContent = await getFaqContent();
        setContent(faqContent);
      } catch (error) {
        console.error("Failed to fetch FAQ content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <section className="relative w-full h-[60vh] flex items-end justify-start text-left text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <Image
            src={content?.heroImageUrl || "https://placehold.co/1600x960.png"}
            alt="Abstract background for FAQs"
            fill
            className="object-cover"
            data-ai-hint="abstract question mark"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 p-8 md:p-12"
      >
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/2" />
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              {content?.heroTitle}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">
              {content?.heroSubtitle}
            </p>
          </>
        )}
      </motion.div>
    </section>
  );
}
