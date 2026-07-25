import { FaInstagram, FaFacebook, FaLinkedin, FaTiktok, FaYoutube, FaXTwitter, FaGoogle, FaEnvelope, FaBlog } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { Share2 } from 'lucide-react';

interface PlatformIconProps {
  platform: string;
  className?: string;
}

export function PlatformIcon({ platform, className }: PlatformIconProps) {
  const p = platform.toLowerCase();
  
  if (p.includes('instagram')) return <FaInstagram className={cn('text-pink-500', className)} />;
  if (p.includes('facebook')) return <FaFacebook className={cn('text-blue-500', className)} />;
  if (p.includes('linkedin')) return <FaLinkedin className={cn('text-blue-700', className)} />;
  if (p.includes('tiktok')) return <FaTiktok className={cn('text-foreground', className)} />;
  if (p.includes('youtube')) return <FaYoutube className={cn('text-red-500', className)} />;
  if (p.includes('twitter') || p.includes('x')) return <FaXTwitter className={cn('text-foreground', className)} />;
  if (p.includes('google')) return <FaGoogle className={cn('text-blue-400', className)} />;
  if (p.includes('email')) return <FaEnvelope className={cn('text-yellow-500', className)} />;
  if (p.includes('blog')) return <FaBlog className={cn('text-orange-500', className)} />;
  
  return <Share2 className={cn('text-muted-foreground', className)} />;
}
