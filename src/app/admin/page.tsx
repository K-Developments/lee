
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getHeroContent, updateHeroContent, HeroContent, uploadImageAndGetURL, ServiceSlide, StoryNewsItem, ButtonContent } from '@/services/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { X, PlusCircle } from 'lucide-react';

export default function AdminHomePage() {
  const { toast } = useToast();
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getHeroContent();
        setHeroContent(content);
      } catch (error) {
        console.error("Failed to fetch hero content:", error);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (heroContent) {
      setHeroContent({ ...heroContent, [name]: value });
    }
  };
  
  const handleAddImageUrl = () => {
    if (newImageUrl && heroContent) {
      const updatedUrls = [...(heroContent.imageUrls || []), newImageUrl];
      setHeroContent({ ...heroContent, imageUrls: updatedUrls });
      setNewImageUrl('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && heroContent) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const { url } = await uploadImageAndGetURL(file);
        const updatedUrls = [...(heroContent.imageUrls || []), url];
        const updatedContent = { ...heroContent, imageUrls: updatedUrls };
        setHeroContent(updatedContent);
        
        await updateHeroContent(updatedContent);
        
        toast({
            title: "Success!",
            description: "Image uploaded and saved successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    if (heroContent) {
      const updatedUrls = heroContent.imageUrls.filter((_, i) => i !== index);
      setHeroContent({ ...heroContent, imageUrls: updatedUrls });
    }
  };

  const handleServiceSlideChange = (index: number, field: keyof ServiceSlide, value: string) => {
    if (heroContent) {
      const updatedSlides = [...heroContent.serviceSlides];
      updatedSlides[index] = { ...updatedSlides[index], [field]: value };
      setHeroContent({ ...heroContent, serviceSlides: updatedSlides });
    }
  };
  
  const handleServiceSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0] && heroContent) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const { url } = await uploadImageAndGetURL(file);
        const updatedSlides = [...heroContent.serviceSlides];
        updatedSlides[index] = { ...updatedSlides[index], image: url };
        const updatedContent = { ...heroContent, serviceSlides: updatedSlides };
        setHeroContent(updatedContent);
        
        await updateHeroContent(updatedContent);
        
        toast({
          title: "Success!",
          description: "Service slide image uploaded and saved.",
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveServiceSlide = (index: number) => {
    if (heroContent) {
      const updatedSlides = heroContent.serviceSlides.filter((_, i) => i !== index);
      setHeroContent({ ...heroContent, serviceSlides: updatedSlides });
    }
  };

  const handleAddServiceSlide = () => {
    if (heroContent) {
      const newSlide: ServiceSlide = { text: "New Service", image: "https://placehold.co/400x400.png", hint: "new service" };
      const updatedSlides = [...heroContent.serviceSlides, newSlide];
      setHeroContent({ ...heroContent, serviceSlides: updatedSlides });
    }
  };

  const handleStoryNewsChange = (section: 'story' | 'news', field: keyof StoryNewsItem, value: string) => {
    if (heroContent) {
      setHeroContent({
        ...heroContent,
        storiesAndNews: {
          ...heroContent.storiesAndNews,
          [section]: {
            ...heroContent.storiesAndNews[section],
            [field]: value,
          },
        },
      });
    }
  };

  const handleStoryNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: 'story' | 'news') => {
    if (e.target.files && e.target.files[0] && heroContent) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const { url } = await uploadImageAndGetURL(file);
        const updatedContent = {
          ...heroContent,
          storiesAndNews: {
            ...heroContent.storiesAndNews,
            [section]: {
              ...heroContent.storiesAndNews[section],
              imageUrl: url,
            },
          },
        };
        setHeroContent(updatedContent);
        
        await updateHeroContent(updatedContent);
        
        toast({
          title: "Success!",
          description: "Image uploaded and saved successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleButtonChange = (button: 'primaryButton' | 'secondaryButton', field: keyof ButtonContent, value: string) => {
    if (heroContent) {
      setHeroContent({
        ...heroContent,
        [button]: {
          ...heroContent[button],
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroContent) return;

    try {
      await updateHeroContent(heroContent);
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
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
             <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
             <Skeleton className="h-10 w-full" />
             <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Content Management</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Home Page Hero Section</CardTitle>
            <CardDescription>Update the title and subtitle for the main hero section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Hero Title</Label>
              <Textarea
                id="title"
                name="title"
                value={heroContent?.title || ''}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Hero Subtitle</Label>
              <Textarea
                id="subtitle"
                name="subtitle"
                value={heroContent?.subtitle || ''}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Buttons</CardTitle>
            <CardDescription>Update the text and links for the hero section buttons.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Primary Button</h3>
              <div className="space-y-2">
                <Label htmlFor="primary-button-text">Button Text</Label>
                <Input
                  id="primary-button-text"
                  value={heroContent?.primaryButton?.text || ''}
                  onChange={(e) => handleButtonChange('primaryButton', 'text', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-button-link">Button Link</Label>
                <Input
                  id="primary-button-link"
                  value={heroContent?.primaryButton?.link || ''}
                  onChange={(e) => handleButtonChange('primaryButton', 'link', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Secondary Button</h3>
              <div className="space-y-2">
                <Label htmlFor="secondary-button-text">Button Text</Label>
                <Input
                  id="secondary-button-text"
                  value={heroContent?.secondaryButton?.text || ''}
                  onChange={(e) => handleButtonChange('secondaryButton', 'text', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-button-link">Button Link</Label>
                <Input
                  id="secondary-button-link"
                  value={heroContent?.secondaryButton?.link || ''}
                  onChange={(e) => handleButtonChange('secondaryButton', 'link', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Hero Images</CardTitle>
            <CardDescription>Manage the images displayed in the main hero section slider.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Current Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(heroContent?.imageUrls || []).map((url, index) => (
                    <div key={index} className="relative group">
                      <Image src={url} alt={`Hero image ${index + 1}`} width={200} height={300} className="object-cover w-full h-auto"/>
                      <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-image-url">Add Image by URL</Label>
                <div className="flex gap-2">
                    <Input id="new-image-url" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://example.com/image.png" />
                    <Button type="button" onClick={handleAddImageUrl}>Add URL</Button>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="image-upload">Or Upload an Image</Label>
                <Input id="image-upload" type="file" onChange={handleImageUpload} accept="image/*" disabled={isUploading}/>
                {isUploading && <p>Uploading...</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Service Slides</CardTitle>
            <CardDescription>Manage the small square slides at the bottom of the hero image.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(heroContent?.serviceSlides || []).map((slide, index) => (
                <Card key={index} className="relative p-4">
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveServiceSlide(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`slide-text-${index}`}>Slide Text</Label>
                      <Input id={`slide-text-${index}`} value={slide.text} onChange={(e) => handleServiceSlideChange(index, 'text', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Slide Image</Label>
                      <Image src={slide.image} alt={slide.text} width={100} height={100} className="object-cover aspect-square" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`slide-image-url-${index}`}>Image URL</Label>
                      <Input id={`slide-image-url-${index}`} value={slide.image} onChange={(e) => handleServiceSlideChange(index, 'image', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`slide-image-upload-${index}`}>Or Upload New Image</Label>
                      <Input id={`slide-image-upload-${index}`} type="file" onChange={(e) => handleServiceSlideImageUpload(e, index)} accept="image/*" disabled={isUploading} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor={`slide-hint-${index}`}>AI Hint</Label>
                      <Input id={`slide-hint-${index}`} value={slide.hint} onChange={(e) => handleServiceSlideChange(index, 'hint', e.target.value)} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={handleAddServiceSlide} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Service Slide
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stories & News Section</CardTitle>
            <CardDescription>Manage the content for the Stories and News cards on the homepage.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Limidora Stories Card */}
              <Card className="p-4">
                <CardTitle className="mb-4 text-lg">Limidora Stories</CardTitle>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="story-title">Title</Label>
                    <Input id="story-title" value={heroContent?.storiesAndNews?.story.title || ''} onChange={(e) => handleStoryNewsChange('story', 'title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="story-description">Description</Label>
                    <Textarea id="story-description" value={heroContent?.storiesAndNews?.story.description || ''} onChange={(e) => handleStoryNewsChange('story', 'description', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <Image src={heroContent?.storiesAndNews?.story.imageUrl || 'https://placehold.co/800x600.png'} alt="Limidora Stories Image" width={200} height={150} className="object-cover" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="story-image-url">Image URL</Label>
                    <Input id="story-image-url" value={heroContent?.storiesAndNews?.story.imageUrl || ''} onChange={(e) => handleStoryNewsChange('story', 'imageUrl', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="story-image-upload">Or Upload New Image</Label>
                      <Input id="story-image-upload" type="file" onChange={(e) => handleStoryNewsImageUpload(e, 'story')} accept="image/*" disabled={isUploading} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="story-image-hint">AI Hint</Label>
                    <Input id="story-image-hint" value={heroContent?.storiesAndNews?.story.imageHint || ''} onChange={(e) => handleStoryNewsChange('story', 'imageHint', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="story-link">Link</Label>
                    <Input id="story-link" value={heroContent?.storiesAndNews?.story.link || ''} onChange={(e) => handleStoryNewsChange('story', 'link', e.target.value)} />
                  </div>
                </div>
              </Card>
              {/* News & Blog Card */}
              <Card className="p-4">
                 <CardTitle className="mb-4 text-lg">News & Blog</CardTitle>
                 <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="news-title">Title</Label>
                    <Input id="news-title" value={heroContent?.storiesAndNews?.news.title || ''} onChange={(e) => handleStoryNewsChange('news', 'title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-description">Description</Label>
                    <Textarea id="news-description" value={heroContent?.storiesAndNews?.news.description || ''} onChange={(e) => handleStoryNewsChange('news', 'description', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <Image src={heroContent?.storiesAndNews?.news.imageUrl || 'https://placehold.co/800x600.png'} alt="News & Blog Image" width={200} height={150} className="object-cover" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-image-url">Image URL</Label>
                    <Input id="news-image-url" value={heroContent?.storiesAndNews?.news.imageUrl || ''} onChange={(e) => handleStoryNewsChange('news', 'imageUrl', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="news-image-upload">Or Upload New Image</Label>
                      <Input id="news-image-upload" type="file" onChange={(e) => handleStoryNewsImageUpload(e, 'news')} accept="image/*" disabled={isUploading} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="news-image-hint">AI Hint</Label>
                    <Input id="news-image-hint" value={heroContent?.storiesAndNews?.news.imageHint || ''} onChange={(e) => handleStoryNewsChange('news', 'imageHint', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-link">Link</Label>
                    <Input id="news-link" value={heroContent?.storiesAndNews?.news.link || ''} onChange={(e) => handleStoryNewsChange('news', 'link', e.target.value)} />
                  </div>
                </div>
              </Card>
          </CardContent>
        </Card>

        <Button type="submit" size="lg">Save All Changes</Button>
      </form>
    </div>
  );
}
