
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getAboutContent, AboutContent } from "@/services/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { motion } from "framer-motion";
import { InteractivePanels } from "./interactive-panels";

export function About() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const aboutContent = await getAboutContent();
        setContent(aboutContent);
      } catch (error) {
        console.error("Failed to fetch about content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <section id="about" className="w-full bg-card relative">
      <div className="container mx-auto px-4 md:px-6 pt-12">
        <div className="mb-8">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-medium text-foreground">About</span>
          </nav>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center text-center py-12">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-20 w-3/4" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-12">
            <div className="inline-block bg-secondary px-3 py-1 text-sm text-secondary-foreground mb-4">Our Vision</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              {content?.aboutTitle}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {content?.aboutDescription}
            </p>
          </div>
        )}

        <div className="py-8 md:py-12">
          <div className="relative md:grid md:grid-cols-2 md:gap-8 md:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              {isLoading ? (
                <Skeleton className="w-full h-auto aspect-square rounded-lg" />
              ) : (
                <Image
                  src={content?.conceptsImageUrl || "https://placehold.co/400x400.png"}
                  alt="Limidora Concepts"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover w-full h-auto aspect-square"
                  data-ai-hint="abstract technology design"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 mt-6 md:mt-0 md:absolute md:right-0 md:w-3/5 md:bg-background/80 md:backdrop-blur-sm md:p-8 md:rounded-lg md:-ml-16"
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-9 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold tracking-tight">{content?.conceptsTitle}</h3>
                  <p className="text-muted-foreground md:text-lg">
                    {content?.conceptsDescription}
                  </p>
                  <Link href={content?.conceptsLink || '#'} className="inline-flex items-center font-semibold text-primary hover:underline">
                    Explore <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>

        <div className="py-8 md:py-12">
          <div className="flex flex-col-reverse md:relative md:grid md:grid-cols-2 md:gap-8 md:items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 mt-6 md:mt-0 md:absolute md:left-0 md:w-3/5 md:bg-background/80 md:backdrop-blur-sm md:p-8 md:rounded-lg md:-mr-16 z-10"
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-9 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold tracking-tight">{content?.workflowTitle}</h3>
                  <p className="text-muted-foreground md:text-lg">
                    {content?.workflowDescription}
                  </p>
                  <Link href={content?.workflowLink || '#'} className="inline-flex items-center font-semibold text-primary hover:underline">
                    Explore <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:col-start-2"
            >
              {isLoading ? (
                <Skeleton className="w-full h-auto aspect-square rounded-lg" />
              ) : (
                <Image
                  src={content?.workflowImageUrl || "https://placehold.co/400x400.png"}
                  alt="Our Workflow"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover w-full h-auto aspect-square"
                  data-ai-hint="workflow diagram flowchart"
                />
              )}
            </motion.div>
          </div>
        </div>

      </div>
       <div className="py-8 md:py-12">
          <InteractivePanels content={content} />
      </div>
    </section>
  );
}
