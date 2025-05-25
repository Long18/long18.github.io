import { ContactInfo } from '@/types';

export const personalInfo = {
  fullName: 'Lê Nguyễn Thành Long',
  displayName: 'William',
  title: 'Game Developer',
  avatar: '/assets/images/avatar.png',
  portrait: '/assets/images/avatar-portrait.png',
  birthday: 'June 18, 2000',
  aboutText: [
    'Passionate Game Developer with solid background of using Unreal Engine and Unity Engine in game development.',
    'Expertise in creating and customizing game logic, utilizing SOLID principles for scalable codebases.'
  ]
};

export const contactInfo: ContactInfo = {
  email: 'us.thanhlong18@gmail.com',
  phone: '+84 918 399 443',
  location: 'Ho Chi Minh City',
  social: {
    github: 'https://github.com/long18',
    facebook: 'https://www.facebook.com/William.2418/',
    twitter: 'https://twitter.com/Willlee186',
    linkedin: 'https://www.linkedin.com/in/william186/',
  }
};

export const socialLinks = [
  {
    platform: 'GitHub',
    url: 'https://github.com/long18',
    icon: 'logo-github'
  },
  {
    platform: 'Facebook', 
    url: 'https://www.facebook.com/William.2418/',
    icon: 'logo-facebook'
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/Willlee186', 
    icon: 'logo-twitter'
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/william186/',
    icon: 'logo-linkedin'
  },
  {
    platform: 'Skype',
    url: 'https://join.skype.com/invite/xJY5pgHzba5y',
    icon: 'logo-skype'
  }
];
