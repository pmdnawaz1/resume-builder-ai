import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const defaultMetadata: Metadata = {
  title: {
    default: 'ResuMate - Your Lazy Resume Wingman',
    template: '%s | ResuMate'
  },
  description: 'Meet ResuMate, your laid-back resume wingman. Create professional, ATS-friendly resumes while we do all the heavy lifting. Perfect for the professionally lazy! 🦥',
  keywords: [
    'resume builder',
    'CV maker',
    'professional resume',
    'ATS-friendly resume',
    'resume templates',
    'job application',
    'career tools',
    'PDF resume',
    'resume generator',
    'free resume builder'
  ],
  authors: [{ name: 'Sarfaraz Nawaz', url: 'https://pmdnawaz1.vercel.app' }],
  creator: 'Sarfaraz Nawaz',
  publisher: 'Sarfaraz Nawaz',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'ResuMate',
    title: 'ResuMate - Your Lazy Resume Wingman',
    description: 'Meet ResuMate, your laid-back resume wingman. Create professional, ATS-friendly resumes while we do all the heavy lifting.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ResuMate Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResuMate - Your Lazy Resume Wingman',
    description: 'Meet ResuMate, your laid-back resume wingman. Create professional, ATS-friendly resumes while we do all the heavy lifting.',
    images: ['/twitter-image.jpg'],
    creator: '@yourtwitterhandle',
  },
  verification: {
    google: 'your-google-site-verification',
  },
  category: 'technology',
};

export default defaultMetadata;
