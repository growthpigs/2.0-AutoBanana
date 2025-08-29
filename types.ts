export type FormatType = 'mockup' | 'social' | 'facebook';

export interface AdFormat {
  id: number;
  name: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  type: FormatType;
}

export interface GeneratedAdResult {
    imageUrl: string | null;
    text: string | null;
}

export interface MockupContent {
    imageUrl: string;
    slogan: string;
}

export interface FacebookAdContent {
    imageUrl: string;
    headline: string;
    bodyText: string;
}

export type GeneratedContent = MockupContent | FacebookAdContent;

export type SloganType = 'hook' | 'meme' | 'joke' | 'quote' | 'fun_fact' | 'tagline';

export interface UploadedImage {
    id: string;
    file: File;
    previewUrl: string;
}