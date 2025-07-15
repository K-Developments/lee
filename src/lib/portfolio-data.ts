
export interface Project {
    id: number;
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    aiHint: string;
    category: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern, scalable e-commerce site with a focus on user experience.",
    tags: ["Web Dev", "UI/UX"],
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "website mockup",
    category: "Web Development"
  },
  {
    id: 2,
    title: "Corporate Rebranding",
    description: "Complete brand overhaul for a tech startup, including logo and style guide.",
    tags: ["Branding"],
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "brand guidelines",
    category: "Branding"
  },
  {
    id: 3,
    title: "Mobile Banking App",
    description: "An intuitive mobile app for easy and secure banking on the go.",
    tags: ["UI/UX", "Mobile App"],
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "app interface",
    category: "Mobile"
  },
  {
    id: 4,
    title: "SaaS Dashboard",
    description: "A data-rich dashboard for a SaaS product, focusing on clarity and usability.",
    tags: ["Web Dev", "UI/UX"],
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "dashboard analytics",
    category: "Web Development"
  },
  {
    id: 5,
    title: "Marketing Website",
    description: "A compelling marketing site to drive conversions and showcase products.",
    tags: ["Web Dev", "Marketing"],
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "landing page",
    category: "Web Development"
  },
  {
    id: 6,
    title: "Brand Styleguide",
    description: "A comprehensive styleguide to ensure brand consistency across all channels.",
    tags: ["Branding"],
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "style guide",
    category: "Branding"
  },
];
