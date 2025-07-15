
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFaqContent, FaqContent, submitQuestion } from "@/services/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Faq() {
  const { toast } = useToast();
  const [content, setContent] = useState<FaqContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const cameFromAbout = searchParams.get('from') === 'about';

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

  const handleQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const question = formData.get('question') as string;

    try {
        await submitQuestion({ email, question });
        toast({
            title: "Question Sent!",
            description: "Thanks for reaching out. We'll review your question and may add it to our FAQs.",
        });
        (e.target as HTMLFormElement).reset();
    } catch (error) {
        toast({
            title: "Submission Error",
            description: "There was a problem sending your question. Please try again.",
            variant: "destructive",
        });
    }
  };

  if (isLoading) {
    return (
      <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-24 mx-auto mb-4" />
            <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="w-full bg-background pt-12 pb-12 md:pb-24 lg:pb-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
            <nav className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                {cameFromAbout && (
                  <>
                    <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                    <ChevronRight className="h-4 w-4 mx-1" />
                  </>
                )}
                <span className="font-medium text-foreground">FAQs</span>
            </nav>
        </div>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <Badge variant="outline" className="mb-4">FAQs</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {content?.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content?.description}
            </p>
        </motion.div>
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
        >
            <Accordion type="single" collapsible className="w-full">
            {content?.faqs.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                    {item.answer}
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </motion.div>
        <div className="text-center mt-12">
           <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">Ask a Question</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ask Your Question</DialogTitle>
                  <DialogDescription>
                    Can't find the answer you're looking for? Fill out the form below and we'll get back to you.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleQuestionSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input id="email" name="email" type="email" required className="col-span-3" placeholder="your@email.com" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="question" className="text-right pt-2">
                        Question
                      </Label>
                      <Textarea id="question" name="question" required className="col-span-3 min-h-[120px]" placeholder="What would you like to know?" />
                    </div>
                  </div>
                   <div className="flex justify-end">
                      <DialogClose asChild>
                          <Button type="submit">Submit Question</Button>
                      </DialogClose>
                    </div>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>
    </section>
  );
}
