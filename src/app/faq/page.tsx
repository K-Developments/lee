
import { Faq } from "@/components/sections/faq";
import { MotionWrapper } from "@/components/motion-wrapper";
import { FaqHero } from "@/components/sections/faq-hero";

export default function FaqPage() {
    return (
        <MotionWrapper>
            <FaqHero />
            <Faq />
        </MotionWrapper>
    );
}
