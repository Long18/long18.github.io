'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ExternalLink,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/Long18',
    icon: Github,
    color: 'hover:text-gray-900 dark:hover:text-gray-100',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/long18',
    icon: Linkedin,
    color: 'hover:text-blue-600',
  },
  {
    name: 'Email',
    href: 'mailto:longnguyen.fut@gmail.com',
    icon: Mail,
    color: 'hover:text-red-500',
  },
];

const quickLinks = [
  { name: 'footer.about', href: '/about' },
  { name: 'footer.projects', href: '/projects' },
  { name: 'footer.blog', href: '/blog' },
  { name: 'footer.contact', href: '/contact' },
];

const projectCategories = [
  { name: 'footer.web_games', href: '/projects?category=web-game' },
  { name: 'footer.mobile_games', href: '/projects?category=mobile-game' },
  { name: 'footer.applications', href: '/projects?category=application' },
  { name: 'footer.web_development', href: '/projects?category=web-development' },
];

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                L
              </div>
              <span className="text-xl font-bold text-foreground">Long.dev</span>
            </div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:longnguyen.fut@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  longnguyen.fut@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a 
                  href="tel:+84123456789"
                  className="hover:text-primary transition-colors"
                >
                  +84 123 456 789
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {t(link.name)}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/resume.pdf"
                  download
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                >
                  <Download className="h-3 w-3 mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    {t('footer.download_resume')}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Project Categories */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              {t('footer.projects')}
            </h3>
            <ul className="space-y-3">
              {projectCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {t(category.name)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links & Newsletter */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              {t('footer.connect')}
            </h3>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-muted-foreground transition-all duration-200',
                      social.color,
                      'hover:scale-110 hover:bg-primary hover:text-primary-foreground'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>

            {/* Newsletter Signup */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                {t('footer.newsletter_text')}
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder={t('footer.email_placeholder')}
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>© {currentYear} Long.dev.</span>
              <span>{t('footer.rights_reserved')}</span>
              <span>{t('footer.made_with')}</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>{t('footer.in_vietnam')}</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.privacy_policy')}
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.terms_of_service')}
              </Link>
              <a
                href="https://github.com/Long18/long18.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <span>{t('footer.source_code')}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
