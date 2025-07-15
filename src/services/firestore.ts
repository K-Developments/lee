
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface ServiceSlide {
  text: string;
  image: string;
  hint: string;
}

export interface StoryNewsItem {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  link: string;
}

export interface ButtonContent {
  text: string;
  link: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  imageUrls: string[];
  serviceSlides: ServiceSlide[];
  storiesAndNews: {
    story: StoryNewsItem;
    news: StoryNewsItem;
  };
  primaryButton: ButtonContent;
  secondaryButton: ButtonContent;
}

export interface InteractivePanelContent {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  link: string;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutDescription: string;
  conceptsTitle: string;
  conceptsDescription: string;
  conceptsImageUrl: string;
  conceptsLink: string;
  workflowTitle: string;
  workflowDescription: string;
  workflowImageUrl: string;
  workflowLink: string;
  interactivePanels: {
    faq: InteractivePanelContent;
    testimonials: InteractivePanelContent;
    solutions: InteractivePanelContent;
  }
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  title: string;
  description: string;
  faqs: FaqItem[];
}

export interface SubmittedQuestion {
    id: string;
    email: string;
    question: string;
    submittedAt: Date;
}

const HERO_CONTENT_DOC_ID = 'heroContent';
const ABOUT_CONTENT_DOC_ID = 'aboutContent';
const FAQ_CONTENT_DOC_ID = 'faqContent';
const CONTENT_COLLECTION_ID = 'homepage';
const SUBMITTED_QUESTIONS_COLLECTION_ID = 'submittedQuestions';

const defaultHeroContent: HeroContent = {
    title: "We Create Digital Experiences That Matter",
    subtitle: "Award-winning creative agency focused on branding, web design and development",
    imageUrls: [
      "https://placehold.co/800x1200.png",
      "https://placehold.co/800x1200.png",
      "https://placehold.co/800x1200.png",
    ],
    serviceSlides: [
      { text: "Web", image: "https://placehold.co/400x400.png", hint: "modern website" },
      { text: "Mobile App", image: "https://placehold.co/400x400.png", hint: "app interface" },
      { text: "Web Application", image: "https://placehold.co/400x400.png", hint: "saas dashboard" },
      { text: "Software", image: "https://placehold.co/400x400.png", hint: "custom software" },
    ],
    storiesAndNews: {
      story: {
        title: "Limidora Stories",
        description: "Discover the projects and people behind our success.",
        imageUrl: "https://placehold.co/800x600.png",
        imageHint: "team working office",
        link: "#"
      },
      news: {
        title: "News & Blog",
        description: "Insights, trends, and thoughts from our team.",
        imageUrl: "https://placehold.co/800x600.png",
        imageHint: "person writing blog",
        link: "#"
      }
    },
    primaryButton: {
      text: "View Our Work",
      link: "/portfolio"
    },
    secondaryButton: {
      text: "Get in Touch",
      link: "/contact"
    }
};

const defaultAboutContent: AboutContent = {
  heroTitle: "About Limidora",
  heroSubtitle: "We are a team of passionate creators, thinkers, and innovators dedicated to building exceptional digital experiences.",
  heroImageUrl: "https://placehold.co/1600x640.png",
  aboutTitle: "About Limidora",
  aboutDescription: "At Limidora, we are always trying to innovate new things with next-level ideas. In this time, everyone needs to touch the technology, and we are making solutions with technology to improve the lives and businesses of our clients.",
  conceptsTitle: "Limidora Concepts",
  conceptsDescription: "We provide solutions for businesses of all types and sizes. Whether your business is large or small, our concepts are designed to integrate modern technology seamlessly. In today's world, every business needs to adapt and evolve. We create tailored technological solutions to improve your processes, reach, and overall success.",
  conceptsImageUrl: "https://placehold.co/400x400.png",
  conceptsLink: "/portfolio",
  workflowTitle: "Our Workflow",
  workflowDescription: "Our process is collaborative and transparent. We start with discovery and strategy, move to design and development, and finish with testing and launch. We keep you involved every step of the way to ensure the final product exceeds your expectations.",
  workflowImageUrl: "https://placehold.co/400x400.png",
  workflowLink: "/contact",
  interactivePanels: {
    faq: {
      title: "Frequently Asked Questions",
      description: "Find answers to common questions about our services, processes, and technology. We believe in transparency and are here to provide the clarity you need.",
      imageUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=3000&auto=format&fit=crop",
      imageHint: "question mark abstract",
      link: "/faq?from=about",
    },
    testimonials: {
      title: "What Our Clients Say",
      description: "Our clients' success is our success. Read stories and testimonials from businesses we've helped transform with our digital solutions.",
      imageUrl: "https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=3000&auto=format&fit=crop",
      imageHint: "customer review happy",
      link: "#",
    },
    solutions: {
      title: "Our Service Overview",
      description: "From web development and UI/UX design to comprehensive brand strategies, we offer a full suite of services to bring your digital vision to life.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3000&auto=format&fit=crop",
      imageHint: "business solution puzzle",
      link: "#",
    },
  }
};

const defaultFaqContent: FaqContent = {
  heroTitle: "Help Center",
  heroSubtitle: "Your questions, answered. Find the information you need about our services.",
  heroImageUrl: "https://placehold.co/1600x960.png",
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about our services, processes, and how we can help your business succeed.",
  faqs: [
    {
      question: "What services do you offer?",
      answer: "We offer a wide range of services including custom web development, UI/UX design, brand strategy, and mobile application development. Our goal is to provide comprehensive digital solutions tailored to your business needs."
    },
    {
      question: "How long does a typical project take?",
      answer: "The timeline for a project varies depending on its scope and complexity. A simple website might take 4-6 weeks, while a complex web application could take several months. We provide a detailed project timeline after our initial discovery phase."
    },
    {
      question: "What is your development process?",
      answer: "Our process is collaborative and transparent. We start with a discovery phase to understand your goals, followed by strategy, design, development, testing, and deployment. We maintain open communication throughout the project to ensure we're aligned with your vision."
    },
    {
      question: "How much does a project cost?",
      answer: "Project costs are based on the specific requirements and complexity of the work. We provide a detailed proposal and quote after discussing your needs. We offer flexible pricing models to accommodate various budgets."
    },
    {
      question: "Do you provide support after the project is launched?",
      answer: "Yes, we offer ongoing support and maintenance packages to ensure your website or application remains secure, up-to-date, and performs optimally. We're here to be your long-term technology partner."
    }
  ]
};

// Deep merge utility to combine existing and new content
const deepMerge = (target: any, source: any) => {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = deepMerge(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }

    return output;
}

const isObject = (item: any) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

// Function to get hero content from Firestore
export const getHeroContent = async (): Promise<HeroContent> => {
  const docRef = doc(db, CONTENT_COLLECTION_ID, HERO_CONTENT_DOC_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    // Deep merge to ensure nested objects are handled correctly and defaults are applied
    return deepMerge(defaultHeroContent, data) as HeroContent;
  } else {
    // Return default content if document doesn't exist
    return defaultHeroContent;
  }
};

// Function to update hero content in Firestore
export const updateHeroContent = async (content: HeroContent): Promise<void> => {
  const docRef = doc(db, CONTENT_COLLECTION_ID, HERO_CONTENT_DOC_ID);
   try {
    const existingDoc = await getDoc(docRef);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    const mergedContent = deepMerge(existingData, content);
    await setDoc(docRef, mergedContent);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw new Error("Could not update hero content.");
  }
};

// Function to get about content from Firestore
export const getAboutContent = async (): Promise<AboutContent> => {
  const docRef = doc(db, CONTENT_COLLECTION_ID, ABOUT_CONTENT_DOC_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return deepMerge(defaultAboutContent, data) as AboutContent;
  } else {
    return defaultAboutContent;
  }
};

// Function to update about content in Firestore
export const updateAboutContent = async (content: AboutContent): Promise<void> => {
  const docRef = doc(db, CONTENT_COLLECTION_ID, ABOUT_CONTENT_DOC_ID);
  try {
    const existingDoc = await getDoc(docRef);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    const mergedContent = deepMerge(existingData, content);
    await setDoc(docRef, mergedContent);
  } catch (error) {
    console.error("Error updating about content: ", error);
    throw new Error("Could not update about content.");
  }
};

// Function to get FAQ content from Firestore
export const getFaqContent = async (): Promise<FaqContent> => {
  const docRef = doc(db, CONTENT_COLLECTION_ID, FAQ_CONTENT_DOC_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return deepMerge(defaultFaqContent, data) as FaqContent;
  } else {
    return defaultFaqContent;
  }
};

// Function to update FAQ content in Firestore
export const updateFaqContent = async (content: FaqContent): Promise<void> => {
  const docRef = doc(db, CONTENT_COLLECTION_ID, FAQ_CONTENT_DOC_ID);
  try {
    const existingDoc = await getDoc(docRef);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    const mergedContent = deepMerge(existingData, content);
    await setDoc(docRef, mergedContent);
  } catch (error) {
    console.error("Error updating FAQ content: ", error);
    throw new Error("Could not update FAQ content.");
  }
};


// Function to upload an image and get URL
export const uploadImageAndGetURL = async (imageFile: File): Promise<{
  url: string;
  path: string; // Storage path
}> => {
  if (!imageFile) {
    throw new Error("No image file provided.");
  }

  const storageRef = ref(storage, `page-images/${Date.now()}_${imageFile.name}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw new Error("Could not upload image.");
  }
};

// Function to submit a new question
export const submitQuestion = async (data: { email: string; question: string }): Promise<void> => {
    try {
        await addDoc(collection(db, SUBMITTED_QUESTIONS_COLLECTION_ID), {
            ...data,
            submittedAt: serverTimestamp(),
            status: 'new',
        });
    } catch (error) {
        console.error("Error submitting question: ", error);
        throw new Error("Could not submit question.");
    }
};

// Function to get all submitted questions
export const getSubmittedQuestions = async (): Promise<SubmittedQuestion[]> => {
    const questionsCol = collection(db, SUBMITTED_QUESTIONS_COLLECTION_ID);
    const snapshot = await getDocs(questionsCol);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            email: data.email,
            question: data.question,
            submittedAt: data.submittedAt?.toDate(),
        };
    });
};

// Function to delete a submitted question
export const deleteSubmittedQuestion = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, SUBMITTED_QUESTIONS_COLLECTION_ID, id));
    } catch (error) {
        console.error("Error deleting submitted question: ", error);
        throw new Error("Could not delete submitted question.");
    }
};
