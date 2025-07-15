import { Suspense } from 'react';
import { Faq } from "@/components/sections/faq";
import { MotionWrapper } from "@/components/motion-wrapper";
import { FaqHero } from "@/components/sections/faq-hero";

export const dynamic = 'force-dynamic';

export default function FaqPage() {
    return (
        <MotionWrapper>
            <FaqHero />
            {/* Wrap Faq in Suspense if it uses useSearchParams() */}
            <Suspense fallback={<div>Loading FAQs...</div>}>
                <Faq />
            </Suspense>
        </MotionWrapper>
    );
}
