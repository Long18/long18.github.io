'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Globe,
  Sparkles,
  Heart,
  Coffee,
  CheckCircle,
  AlertCircle,
  Loader,
  ChevronRight,
  User,
  AtSign,
  FileText,
  Diamond,
} from 'lucide-react';
import { contactInfo } from '@/data/personal';
import { sendContactEmail, type EmailData } from '@/services/emailService';
import { professionalStats } from '../../data/skills';
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');

  const { performanceMode, isClient } = useAnimationPerformance();

  // Typing animation effect
  const fullText = "Let's Connect & Create Something Amazing Together!";
  useEffect(() => {
    if (performanceMode === 'low') {
      setTypedText(fullText);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [performanceMode]);

  // Contact stats
  const contactStats = [
    {
      icon: Clock,
      label: 'Response Time',
      value: professionalStats.responseTime,
      color: 'orange',
    },
    {
      icon: Globe,
      label: 'Availability',
      value: professionalStats.availability,
      color: 'purple',
    },
    {
      icon: MessageCircle,
      label: 'Languages',
      value: professionalStats.languages,
      color: 'cyan',
    },
    {
      icon: Coffee,
      label: 'Projects',
      value: professionalStats.projectsReady,
      color: 'emerald',
    },
  ];

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const sendEmail = async (data: EmailData): Promise<string> => {
    try {
      console.log('🚀 Attempting to send email via EmailJS...', data);
      const result = await sendContactEmail(data);
      return result;
    } catch (error) {
      console.error('❌ Failed to send email via EmailJS:', error);

      if (error instanceof Error && error.message.includes('not configured')) {
        console.log('📖 EmailJS not configured, using mailto fallback');
        alert(
          '⚙️ EmailJS chưa được cấu hình. Sẽ mở email client để gửi email thủ công.\n\n📖 Xem docs/EMAILJS_SETUP.md để setup EmailJS'
        );
      }

      const mailtoLink = `mailto:us.thanhlong18@gmail.com?subject=${encodeURIComponent(
        data.subject
      )}&body=${encodeURIComponent(
        `Tên: ${data.name}\nEmail: ${data.email}\nTin nhắn: ${data.message}`
      )}`;
      window.open(mailtoLink, '_blank');
      return 'Fallback: Email client opened';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      console.log('Form data being sent:', formData);

      const result = await sendEmail({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      console.log('Contact form submitted successfully:', formData);
      console.log('Email send result:', result);

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      if (result.includes('Fallback')) {
        alert(
          'Đã mở ứng dụng email của bạn với nội dung được điền sẵn. Vui lòng gửi từ đó để hoàn tất!'
        );
      } else {
        alert(
          'Email đã được gửi thành công! Tôi sẽ phản hồi bạn sớm nhất có thể. 🚀'
        );
      }
    } catch (error) {
      console.error('Error opening email client:', error);
      setSubmitStatus('error');
      alert(
        'Sorry, there was an error opening your email client. Please contact me directly at us.thanhlong18@gmail.com'
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 4000);
    }
  };

  const contactDetails = [
    {
      icon: Phone,
      title: 'Call Me',
      value: contactInfo.phone,
      href: contactInfo.phone
        ? `tel:${contactInfo.phone.replace(/\s/g, '')}`
        : undefined,
      color: 'orange',
      description: 'Ready to discuss your project',
    },
    {
      icon: Mail,
      title: 'Email Me',
      value: contactInfo.email,
      href: contactInfo.email ? `mailto:${contactInfo.email}` : undefined,
      color: 'purple',
      description: 'Reach out anytime',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: contactInfo.location,
      href: undefined,
      color: 'cyan',
      description: 'Remote & On-site available',
    },
  ];

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden animate-fade-in-up"
    >
      {/* Animated Background - Only for high performance */}
      {isClient && performanceMode === 'high' && (
        <div className="absolute inset-0 -z-10">
          {/* Gradient orbs */}
          <motion.div
            animate={{
              x: [0, 150, -150, 0],
              y: [0, -120, 120, 0],
              scale: [1, 1.3, 0.7, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/3 left-1/5 w-96 h-96 bg-gradient-to-r from-orange-500/25 to-purple-500/25 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -200, 200, 0],
              y: [0, 200, -200, 0],
              scale: [0.7, 1.4, 0.8, 0.7],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute top-2/3 right-1/5 w-80 h-80 bg-gradient-to-l from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
          />

          {/* Animated grid */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-xl px-6 py-3 rounded-full border border-orange-500/30 mb-6 animate-scale-in">
            <motion.div
              animate={performanceMode === 'high' ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Diamond className="w-5 h-5 text-orange-400" />
            </motion.div>
            <span className="text-orange-300 font-semibold">Get In Touch</span>
          </div>

          <h1
            className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Contact Me
            </span>
          </h1>

          <div
            className="text-xl text-white-2 max-w-3xl mx-auto leading-relaxed mb-4 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            {typedText}
            {performanceMode !== 'low' && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-orange-400"
              >
                |
              </motion.span>
            )}
          </div>

          <p
            className="text-white-2/80 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Whether you have a project in mind, want to collaborate, or just say
            hello - I&apos;d love to hear from you!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={
                performanceMode !== 'low' ? { scale: 1.05, rotateY: 10 } : {}
              }
              transition={{ duration: 0.3 }}
              className="relative group animate-scale-in"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="bg-gradient-to-br from-eerie-black-1/80 to-eerie-black-2/80 backdrop-blur-xl rounded-3xl p-6 border border-jet/50 hover:border-orange-500/50 transition-all duration-500 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.div
                  whileHover={
                    performanceMode !== 'low' ? { rotate: 360, scale: 1.2 } : {}
                  }
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-${stat.color}-500/20 to-${stat.color}-600/20 rounded-2xl mb-4 relative z-10`}
                >
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                </motion.div>

                <h3
                  className="text-2xl font-bold text-white-1 mb-2 relative z-10 animate-count-up"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  {stat.value}
                </h3>

                <p className="text-white-2 text-sm font-medium relative z-10">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactDetails.map((detail, index) => (
            <motion.div
              key={index}
              whileHover={
                performanceMode !== 'low' ? { y: -10, scale: 1.05 } : {}
              }
              transition={{ duration: 0.3 }}
              className="relative group animate-slide-in-up"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className="bg-gradient-to-br from-eerie-black-1/90 to-eerie-black-2/90 backdrop-blur-xl rounded-3xl p-6 border border-jet/50 hover:border-orange-500/50 transition-all duration-500 text-center overflow-hidden min-h-[280px] flex flex-col justify-between shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-purple-500/10 to-cyan-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.div
                  whileHover={
                    performanceMode !== 'low' ? { rotate: 360, scale: 1.2 } : {}
                  }
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-${detail.color}-500/20 to-${detail.color}-600/20 rounded-2xl mb-4 relative z-10 group-hover:shadow-lg group-hover:shadow-${detail.color}-500/30`}
                >
                  <detail.icon className={`w-8 h-8 text-${detail.color}-400`} />
                </motion.div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-white-1 mb-2 relative z-10 group-hover:text-orange-300 transition-colors duration-300">
                    {detail.title}
                  </h3>

                  <p className="text-white-2/80 text-xs mb-3 relative z-10">
                    {detail.description}
                  </p>

                  <div className="mt-auto">
                    {detail.href ? (
                      <motion.a
                        href={detail.href}
                        whileHover={
                          performanceMode !== 'low' ? { scale: 1.05 } : {}
                        }
                        whileTap={{ scale: 0.95 }}
                        className={`inline-block text-${detail.color}-300 font-semibold hover:text-white-1 transition-colors duration-300 relative z-10 bg-${detail.color}-500/25 border border-${detail.color}-400/20 px-4 py-3 rounded-2xl hover:bg-${detail.color}-500/40 hover:border-${detail.color}-400/40 text-center text-sm max-w-full break-words leading-tight shadow-sm`}
                      >
                        {detail.value}
                      </motion.a>
                    ) : (
                      <span className="text-white-1 font-medium relative z-10 block bg-eerie-black-1/50 border border-jet/30 px-4 py-3 rounded-2xl text-center text-sm max-w-full break-words leading-tight shadow-sm">
                        {detail.value}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Contact Form */}
        <div
          className="max-w-4xl mx-auto animate-slide-in-up"
          style={{ animationDelay: '1s' }}
        >
          <div className="bg-gradient-to-br from-eerie-black-1/60 to-eerie-black-2/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-jet/50 hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden">
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-purple-500/5 to-cyan-400/5 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              {/* Form Header */}
              <div
                className="text-center mb-12 animate-fade-in-up"
                style={{ animationDelay: '1.1s' }}
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <motion.div
                    animate={
                      performanceMode === 'high' ? { rotate: [0, 360] } : {}
                    }
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 p-3 rounded-2xl"
                  >
                    <Send className="w-8 h-8 text-orange-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold text-white-1">
                      Send Message
                    </h3>
                    <p className="text-white-2">
                      Let&apos;s start a conversation
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div
                    className="relative group animate-slide-in-left"
                    style={{ animationDelay: '1.2s' }}
                  >
                    <label className="flex items-center gap-2 text-white-2 text-sm font-medium mb-3">
                      <User className="w-4 h-4" />
                      Your Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={handleBlur}
                        placeholder="Enter your full name"
                        className={`w-full px-6 py-4 bg-eerie-black-2/50 backdrop-blur-sm border rounded-2xl text-white-1 placeholder-white-2/60 focus:outline-none transition-all duration-500 hover:bg-eerie-black-2/70 ${
                          errors.name
                            ? 'border-red-500 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/20'
                            : focusedField === 'name'
                            ? 'border-orange-500 focus:shadow-lg focus:shadow-orange-500/20'
                            : 'border-jet hover:border-jet/70'
                        }`}
                        required
                      />
                      {focusedField === 'name' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                        />
                      )}
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-400 text-sm mt-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div
                    className="relative group animate-slide-in-right"
                    style={{ animationDelay: '1.3s' }}
                  >
                    <label className="flex items-center gap-2 text-white-2 text-sm font-medium mb-3">
                      <AtSign className="w-4 h-4" />
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                        placeholder="your.email@example.com"
                        className={`w-full px-6 py-4 bg-eerie-black-2/50 backdrop-blur-sm border rounded-2xl text-white-1 placeholder-white-2/60 focus:outline-none transition-all duration-500 hover:bg-eerie-black-2/70 ${
                          errors.email
                            ? 'border-red-500 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/20'
                            : focusedField === 'email'
                            ? 'border-purple-500 focus:shadow-lg focus:shadow-purple-500/20'
                            : 'border-jet hover:border-jet/70'
                        }`}
                        required
                      />
                      {focusedField === 'email' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"
                        />
                      )}
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-400 text-sm mt-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Subject */}
                <div
                  className="relative group animate-slide-in-up"
                  style={{ animationDelay: '1.4s' }}
                >
                  <label className="flex items-center gap-2 text-white-2 text-sm font-medium mb-3">
                    <FileText className="w-4 h-4" />
                    Subject *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('subject')}
                      onBlur={handleBlur}
                      placeholder="What's this about?"
                      className={`w-full px-6 py-4 bg-eerie-black-2/50 backdrop-blur-sm border rounded-2xl text-white-1 placeholder-white-2/60 focus:outline-none transition-all duration-500 hover:bg-eerie-black-2/70 ${
                        errors.subject
                          ? 'border-red-500 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/20'
                          : focusedField === 'subject'
                          ? 'border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20'
                          : 'border-jet hover:border-jet/70'
                      }`}
                      required
                    />
                    {focusedField === 'subject' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full"
                      />
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-400 text-sm mt-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.subject}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message */}
                <div
                  className="relative group animate-slide-in-up"
                  style={{ animationDelay: '1.5s' }}
                >
                  <label className="flex items-center gap-2 text-white-2 text-sm font-medium mb-3">
                    <MessageCircle className="w-4 h-4" />
                    Your Message *
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      placeholder="Tell me about your project, ideas, or just say hello!"
                      rows={6}
                      className={`w-full px-6 py-4 bg-eerie-black-2/50 backdrop-blur-sm border rounded-2xl text-white-1 placeholder-white-2/60 focus:outline-none transition-all duration-500 resize-vertical min-h-[150px] max-h-[300px] hover:bg-eerie-black-2/70 ${
                        errors.message
                          ? 'border-red-500 focus:border-red-400 focus:shadow-lg focus:shadow-red-500/20'
                          : focusedField === 'message'
                          ? 'border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20'
                          : 'border-jet hover:border-jet/70'
                      }`}
                      required
                    />
                    {focusedField === 'message' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
                      />
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-400 text-sm mt-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div
                  className="text-center pt-4 animate-scale-in"
                  style={{ animationDelay: '1.6s' }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={
                      !isSubmitting && performanceMode !== 'low'
                        ? { scale: 1.05 }
                        : {}
                    }
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    className="relative group px-12 py-4 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white-1 font-semibold rounded-2xl transition-all duration-500 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          <Loader className="w-5 h-5" />
                        </motion.div>
                      ) : submitStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : submitStatus === 'error' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <motion.div
                          whileHover={performanceMode !== 'low' ? { x: 5 } : {}}
                          transition={{ duration: 0.2 }}
                        >
                          <Send className="w-5 h-5" />
                        </motion.div>
                      )}

                      <span>
                        {isSubmitting
                          ? 'Sending...'
                          : submitStatus === 'success'
                          ? 'Message Sent!'
                          : submitStatus === 'error'
                          ? 'Send Failed - Try Again'
                          : 'Send Message'}
                      </span>

                      {!isSubmitting &&
                        submitStatus === 'idle' &&
                        performanceMode === 'high' && (
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        )}
                    </div>
                  </motion.button>
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm text-emerald-300 px-6 py-3 rounded-2xl border border-emerald-500/30">
                        <CheckCircle className="w-5 h-5" />
                        <span>
                          Thank you! Your message has been sent successfully.
                          I&apos;ll get back to you soon!
                        </span>
                      </div>
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm text-red-300 px-6 py-3 rounded-2xl border border-red-500/30">
                        <AlertCircle className="w-5 h-5" />
                        <span>
                          Sorry, there was an error sending your message. Please
                          try again or contact me directly.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center mt-16 animate-fade-in"
          style={{ animationDelay: '1.8s' }}
        >
          <div className="inline-flex items-center gap-2 text-white-2/80 text-sm">
            <Heart className="w-4 h-4 text-red-400" />
            <span>
              Made with passion for creating amazing digital experiences
            </span>
            <Sparkles className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
