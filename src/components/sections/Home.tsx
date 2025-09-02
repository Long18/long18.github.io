'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { SplitTextHero, SplitTextDisplay, SplitTextBody, Button, GradientButton } from '@/components/ui';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCV = () => {
    // Download CV logic
    window.open('/assets/cv/CV_Long_Nguyen.pdf', '_blank');
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 modern-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Content */}
      <div className="container-modern relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <SplitTextDisplay className="text-gradient-primary">
              {t('home.greeting', 'Hello, I\'m Long')}
            </SplitTextDisplay>

            <SplitTextHero className="text-foreground">
              {t('home.title', 'Game Developer & Software Engineer')}
            </SplitTextHero>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto">
            <SplitTextBody className="text-muted-foreground text-lg leading-relaxed">
              {t('home.description',
                'Passionate about creating immersive gaming experiences with Unity, Unreal Engine, and modern web technologies. Specializing in game development, interactive applications, and innovative user experiences.'
              )}
            </SplitTextBody>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-muted-foreground">{t('home.stats.experience', 'Years Experience')}</div>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">20+</div>
              <div className="text-muted-foreground">{t('home.stats.projects', 'Projects Completed')}</div>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">10+</div>
              <div className="text-muted-foreground">{t('home.stats.technologies', 'Technologies Mastered')}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
            <GradientButton
              size="lg"
              onClick={() => scrollToSection('portfolio')}
              className="group min-w-[200px]"
            >
              <span className="mr-2">{t('home.cta.portfolio', 'View My Work')}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </GradientButton>

            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadCV}
              className="group min-w-[200px]"
            >
              <svg
                className="w-4 h-4 mr-2 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('home.cta.download', 'Download CV')}
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={() => scrollToSection('about')}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label="Scroll to about section"
            >
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-secondary rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-accent rounded-full animate-ping" style={{ animationDelay: '4s' }} />
        <div className="absolute top-3/4 right-1/3 w-2.5 h-2.5 bg-primary/60 rounded-full animate-ping" style={{ animationDelay: '5s' }} />
      </div>

      {/* Tech Stack Preview */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
        <div className="flex flex-wrap justify-center gap-4 opacity-60">
          {[
            { name: 'Unity', color: 'text-tech-unity' },
            { name: 'Unreal Engine', color: 'text-tech-unreal' },
            { name: 'C#', color: 'text-tech-csharp' },
            { name: 'C++', color: 'text-tech-cpp' },
            { name: 'TypeScript', color: 'text-tech-typescript' },
            { name: 'React', color: 'text-tech-web' },
          ].map((tech, index) => (
            <div
              key={tech.name}
              className={`px-3 py-1 rounded-full bg-muted/20 text-xs font-medium ${tech.color} animate-fade-in-up`}
              style={{ animationDelay: `${1.8 + index * 0.1}s` }}
            >
              {tech.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
