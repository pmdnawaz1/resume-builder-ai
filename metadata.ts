import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Builder AI',
  description: 'Create professional resumes with AI assistance',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://resume-builder.example.com'),
  openGraph: {
    title: 'Resume Builder AI',
    description: 'Create professional resumes with AI assistance',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Builder AI',
    description: 'Create professional resumes with AI assistance',
    images: ['/og-image.png'],
  },
};