
"use client";

import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { getHeroContent, HeroContent, ServiceSlide, StoryNewsItem } from "@/services/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import ParticlesWrapper from "@/components/ParticlesWrapper";
import { Globe, Smartphone, Code, LayoutGrid, ArrowUpRight, Twitter, Linkedin, Facebook } from 'lucide-react';


import "swiper/css";
import "swiper/css/effect-fade";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "Web": Globe,
  "Mobile App": Smartphone,
  "Web Application": LayoutGrid,
  "Software": Code,
};

const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );


const HeroSection = ({ content, isLoading }: { content: HeroContent | null, isLoading: boolean }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !heroRef.current || !heroImageRef.current || !heroContentRef.current) return;

    const tl = gsap.timeline({ delay: 0.3 });
    
    let ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (isMobile) {
        gsap.set(heroImageRef.current, { height: "auto" });
        tl.to(heroImageRef.current, {
          height: "auto",
          duration: 1.2,
          ease: "power3.inOut",
        });
      } else {
        gsap.set(heroImageRef.current, { width: "0%" });
        tl.to(heroImageRef.current, {
          width: "50vw",
          duration: 1.2,
          ease: "power3.inOut",
        });
      }
      
      gsap.set(heroContentRef.current, { opacity: 0, y: 30 });
      tl.to(heroContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.8");

    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, [isLoading]);

  return (
    <section ref={heroRef} className="hero-section relative min-h-screen flex items-center overflow-hidden">
      <ParticlesWrapper />
      <div className="container mx-auto px-6 relative z-10">
        <div ref={heroContentRef} className="max-w-3xl hero-content-container">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full mb-6" />
              <Skeleton className="h-10 w-3/4 mb-10" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </>
          ) : (
            <>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-foreground"
              >
                {content?.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl mb-6 max-w-2xl text-muted-foreground"
              >
                {content?.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex gap-4 mb-10"
              >
                <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </Link>
                </Button>
                 <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="WhatsApp">
                    <WhatsAppIcon className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4 md:justify-start justify-center"
              >
                <Button asChild size="lg">
                  <Link href="/portfolio">View Our Work</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
      
      <div ref={heroImageRef} className="hero-image absolute right-0 bottom-0 h-full flex flex-col justify-end">
        {isLoading ? (
          <Skeleton className="w-full h-full"/>
        ) : (
          <div className="relative h-full w-full">
            <Swiper
              modules={[EffectFade, Autoplay]}
              effect="fade"
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              className="h-full w-full"
            >
              {(content?.imageUrls || []).map((url, index) => (
                <SwiperSlide key={index} className="relative">
                  <Image 
                    src={url} 
                    alt={`Creative work ${index + 1}`} 
                    fill 
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent"></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute bottom-0 left-0 w-full z-10">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={0}
                slidesPerView={2}
                breakpoints={{
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 0
                  },
                }}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  reverseDirection: true,
                }}
                className="w-full"
              >
                {(content?.serviceSlides || []).map((slide, index) => {
                  const Icon = iconMap[slide.text];
                  return (
                    <SwiperSlide key={index} className="border-r border-white/20 last:border-r-0">
                      <div className="aspect-square relative group overflow-hidden">
                        <Image 
                          src={slide.image} 
                          alt={slide.text} 
                          fill 
                          className="object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                          data-ai-hint={slide.hint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center p-4">
                          {Icon && (
                            <Icon className="w-12 h-12 text-white/80 transition-opacity duration-300 group-hover:opacity-0" />
                          )}
                          <h3 className="text-white text-lg font-bold absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {slide.text}
                          </h3>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const StoriesAndNewsSection = ({ content, isLoading }: { content: HeroContent | null, isLoading: boolean }) => {
  if (isLoading || !content?.storiesAndNews) {
    return (
       <section className="w-full md:mt-2">
        <div className="flex flex-col md:flex-row gap-2">
            <Skeleton className="h-[300px] md:h-[400px] w-full" />
            <Skeleton className="h-[300px] md:h-[400px] w-full" />
        </div>
      </section>
    );
  }
  
  const { story, news } = content.storiesAndNews;

  return (
    <section className="w-full md:mt-2">
      <div className="flex flex-col md:flex-row gap-2">
          <Link href={story.link} className="relative group h-[300px] md:h-[400px] overflow-hidden w-full">
              <Image
                  src={story.imageUrl || "https://placehold.co/800x600.png"}
                  alt={story.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                  data-ai-hint={story.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{story.title}</h3>
                  <p className="text-white/90 text-sm md:text-base">{story.description}</p>
              </div>
              <div className="absolute top-4 right-4 bg-background/80 p-2 md:p-3 rounded-full translate-x-14 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </div>
          </Link>
          <Link href={news.link} className="relative group h-[300px] md:h-[400px] overflow-hidden w-full">
              <Image
                  src={news.imageUrl || "https://placehold.co/800x600.png"}
                  alt={news.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                  data-ai-hint={news.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{news.title}</h3>
                  <p className="text-white/90 text-sm md:text-base">{news.description}</p>
              </div>
               <div className="absolute top-4 right-4 bg-background/80 p-2 md:p-3 rounded-full translate-x-14 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </div>
          </Link>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const heroContent = await getHeroContent();
        setContent(heroContent);
      } catch (error) {
        console.error("Failed to fetch hero content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div>
      <HeroSection content={content} isLoading={isLoading} />
      <StoriesAndNewsSection content={content} isLoading={isLoading} />
    </div>
  )
}
