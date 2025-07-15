
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAboutContent, updateAboutContent, AboutContent, uploadImageAndGetURL, InteractivePanelContent } from '@/services/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

type PanelKey = 'faq' | 'testimonials' | 'solutions';

export default function AdminAboutPage() {
  const { toast } = useToast();
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getAboutContent();
        setAboutContent(content);
      } catch (error) {
        console.error("Failed to fetch about content:", error);
        toast({
          title: "Error",
          description: "Failed to load content from the database.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, section: keyof AboutContent, field?: string) => {
    const { name, value } = e.target;
    if (aboutContent) {
        setAboutContent({ ...aboutContent, [name]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof AboutContent | `interactivePanels.${PanelKey}`) => {
    if (e.target.files && e.target.files[0] && aboutContent) {
        const file = e.target.files[0];
        setIsUploading(prev => ({ ...prev, [fieldName]: true }));
        try {
            const { url } = await uploadImageAndGetURL(file);
            if (fieldName.startsWith('interactivePanels.')) {
              const panelKey = fieldName.split('.')[1] as PanelKey;
              handlePanelChange(panelKey, 'imageUrl', url);
            } else {
              setAboutContent({ ...aboutContent, [fieldName]: url });
            }
            toast({
                title: "Success!",
                description: "Image uploaded successfully. Click 'Save All Changes' to apply.",
            });
        } catch (error) {
            toast({
                title: "Upload Error",
                description: `Failed to upload image for ${fieldName}. Please try again.`,
                variant: "destructive",
            });
        } finally {
            setIsUploading(prev => ({ ...prev, [fieldName]: false }));
        }
    }
  };

  const handlePanelChange = (panel: PanelKey, field: keyof InteractivePanelContent, value: string) => {
    if (aboutContent) {
        setAboutContent({
            ...aboutContent,
            interactivePanels: {
                ...aboutContent.interactivePanels,
                [panel]: {
                    ...aboutContent.interactivePanels[panel],
                    [field]: value
                }
            }
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutContent) return;

    try {
      await updateAboutContent(aboutContent);
      toast({
        title: "Success!",
        description: "Content has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">About Page Management</h1>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-10 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">About Page Management</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>About Page Hero Section</CardTitle>
            <CardDescription>Update the title, subtitle, and background image for the About page hero.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                name="heroTitle"
                value={aboutContent?.heroTitle || ''}
                onChange={(e) => handleInputChange(e, 'heroTitle')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Textarea
                id="heroSubtitle"
                name="heroSubtitle"
                value={aboutContent?.heroSubtitle || ''}
                onChange={(e) => handleInputChange(e, 'heroSubtitle')}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
                <Label>Current Hero Image</Label>
                <div className="relative group w-full aspect-video">
                  <Image src={aboutContent?.heroImageUrl || 'https://placehold.co/1600x640.png'} alt="About hero image" layout="fill" className="object-cover rounded-md"/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="heroImageUrl">Image URL</Label>
                <Input
                    id="heroImageUrl"
                    name="heroImageUrl"
                    value={aboutContent?.heroImageUrl || ''}
                    onChange={(e) => handleInputChange(e, 'heroImageUrl')}
                    placeholder="https://example.com/image.png"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="hero-image-upload">Or Upload a New Hero Image</Label>
                <Input id="hero-image-upload" type="file" onChange={(e) => handleImageUpload(e, 'heroImageUrl')} accept="image/*" disabled={isUploading['heroImageUrl']}/>
                {isUploading['heroImageUrl'] && <p>Uploading...</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Section Content</CardTitle>
            <CardDescription>Update the title and description for the main content area on the About page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="aboutTitle">Title</Label>
              <Input
                id="aboutTitle"
                name="aboutTitle"
                value={aboutContent?.aboutTitle || ''}
                onChange={(e) => handleInputChange(e, 'aboutTitle')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutDescription">Description</Label>
              <Textarea
                id="aboutDescription"
                name="aboutDescription"
                value={aboutContent?.aboutDescription || ''}
                onChange={(e) => handleInputChange(e, 'aboutDescription')}
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limidora Concepts Section</CardTitle>
            <CardDescription>Update the content for the 'Concepts' section on the About page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="conceptsTitle">Concepts Title</Label>
              <Input
                id="conceptsTitle"
                name="conceptsTitle"
                value={aboutContent?.conceptsTitle || ''}
                onChange={(e) => handleInputChange(e, 'conceptsTitle')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conceptsDescription">Concepts Description</Label>
              <Textarea
                id="conceptsDescription"
                name="conceptsDescription"
                value={aboutContent?.conceptsDescription || ''}
                onChange={(e) => handleInputChange(e, 'conceptsDescription')}
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conceptsLink">Concepts Link</Label>
              <Input
                id="conceptsLink"
                name="conceptsLink"
                value={aboutContent?.conceptsLink || ''}
                onChange={(e) => handleInputChange(e, 'conceptsLink')}
                placeholder="/portfolio"
              />
            </div>
            <div className="space-y-2">
                <Label>Current Concepts Image</Label>
                <div className="relative group w-full max-w-sm aspect-square">
                  <Image src={aboutContent?.conceptsImageUrl || 'https://placehold.co/400x400.png'} alt="Limidora concepts image" layout="fill" className="object-cover rounded-md"/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="conceptsImageUrl">Image URL</Label>
                <Input
                    id="conceptsImageUrl"
                    name="conceptsImageUrl"
                    value={aboutContent?.conceptsImageUrl || ''}
                    onChange={(e) => handleInputChange(e, 'conceptsImageUrl')}
                    placeholder="https://example.com/image.png"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="concepts-image-upload">Or Upload a New Concepts Image</Label>
                <Input id="concepts-image-upload" type="file" onChange={(e) => handleImageUpload(e, 'conceptsImageUrl')} accept="image/*" disabled={isUploading['conceptsImageUrl']}/>
                {isUploading['conceptsImageUrl'] && <p>Uploading...</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Our Workflow Section</CardTitle>
            <CardDescription>Update the content for the 'Workflow' section on the About page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="workflowTitle">Workflow Title</Label>
              <Input
                id="workflowTitle"
                name="workflowTitle"
                value={aboutContent?.workflowTitle || ''}
                onChange={(e) => handleInputChange(e, 'workflowTitle')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflowDescription">Workflow Description</Label>
              <Textarea
                id="workflowDescription"
                name="workflowDescription"
                value={aboutContent?.workflowDescription || ''}
                onChange={(e) => handleInputChange(e, 'workflowDescription')}
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflowLink">Workflow Link</Label>
              <Input
                id="workflowLink"
                name="workflowLink"
                value={aboutContent?.workflowLink || ''}
                onChange={(e) => handleInputChange(e, 'workflowLink')}
                placeholder="/contact"
              />
            </div>
            <div className="space-y-2">
                <Label>Current Workflow Image</Label>
                <div className="relative group w-full max-w-sm aspect-square">
                  <Image src={aboutContent?.workflowImageUrl || 'https://placehold.co/400x400.png'} alt="Our workflow image" layout="fill" className="object-cover rounded-md"/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="workflowImageUrl">Image URL</Label>
                <Input
                    id="workflowImageUrl"
                    name="workflowImageUrl"
                    value={aboutContent?.workflowImageUrl || ''}
                    onChange={(e) => handleInputChange(e, 'workflowImageUrl')}
                    placeholder="https://example.com/image.png"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="workflow-image-upload">Or Upload a New Workflow Image</Label>
                <Input id="workflow-image-upload" type="file" onChange={(e) => handleImageUpload(e, 'workflowImageUrl')} accept="image/*" disabled={isUploading['workflowImageUrl']}/>
                {isUploading['workflowImageUrl'] && <p>Uploading...</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Interactive Panels Section</CardTitle>
            <CardDescription>Update content and images for the interactive panels (FAQs, Testimonials, Solutions).</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['faq', 'testimonials', 'solutions'] as PanelKey[]).map(panelKey => (
              <Card key={panelKey} className="p-4 space-y-4">
                <h4 className="text-lg font-semibold capitalize">{panelKey}</h4>
                 <div className="space-y-2">
                    <Label htmlFor={`${panelKey}-title`}>Title</Label>
                    <Input id={`${panelKey}-title`} value={aboutContent?.interactivePanels[panelKey]?.title || ''} onChange={(e) => handlePanelChange(panelKey, 'title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${panelKey}-description`}>Description</Label>
                    <Textarea id={`${panelKey}-description`} value={aboutContent?.interactivePanels[panelKey]?.description || ''} onChange={(e) => handlePanelChange(panelKey, 'description', e.target.value)} className="min-h-[120px]"/>
                  </div>
                   <div className="space-y-2">
                      <Label>Current Image</Label>
                      <Image src={aboutContent?.interactivePanels[panelKey]?.imageUrl || 'https://placehold.co/400x400.png'} alt={`${panelKey} panel image`} width={150} height={150} className="object-cover rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${panelKey}-imageUrl`}>Image URL</Label>
                    <Input id={`${panelKey}-imageUrl`} value={aboutContent?.interactivePanels[panelKey]?.imageUrl || ''} onChange={(e) => handlePanelChange(panelKey, 'imageUrl', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${panelKey}-imageHint`}>Image AI Hint</Label>
                    <Input id={`${panelKey}-imageHint`} value={aboutContent?.interactivePanels[panelKey]?.imageHint || ''} onChange={(e) => handlePanelChange(panelKey, 'imageHint', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor={`${panelKey}-link`}>Link</Label>
                    <Input id={`${panelKey}-link`} value={aboutContent?.interactivePanels[panelKey]?.link || ''} onChange={(e) => handlePanelChange(panelKey, 'link', e.target.value)} placeholder="/faq" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${panelKey}-image-upload`}>Or Upload New Image</Label>
                    <Input id={`${panelKey}-image-upload`} type="file" onChange={(e) => handleImageUpload(e, `interactivePanels.${panelKey}`)} accept="image/*" disabled={isUploading[`interactivePanels.${panelKey}`]} />
                    {isUploading[`interactivePanels.${panelKey}`] && <p>Uploading...</p>}
                  </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" size="lg">Save All Changes</Button>
      </form>
    </div>
  );
}
