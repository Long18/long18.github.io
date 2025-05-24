'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMailOutline, IoCallOutline, IoLocationOutline, IoPaperPlaneOutline } from 'react-icons/io5';
import { contactInfo } from '@/data/personal';

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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
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
      // Simulate email sending (replace with actual email service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would send the email here
      console.log('Contact form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 4 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 4000);
    }
  };

  const contactDetails = [
    {
      icon: <IoCallOutline />,
      title: 'Call Me',
      value: contactInfo.phone,
      href: contactInfo.phone ? `tel:${contactInfo.phone.replace(/\s/g, '')}` : undefined
    },
    {
      icon: <IoMailOutline />,
      title: 'Email Me',
      value: contactInfo.email,
      href: contactInfo.email ? `mailto:${contactInfo.email}` : undefined
    },
    {
      icon: <IoLocationOutline />,
      title: 'Address',
      value: contactInfo.location,
      href: undefined
    }
  ];

  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-orange-yellow-crayola text-sm font-medium uppercase tracking-wider"
          >
            Say Hello
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white-1 mt-2"
          >
            Contact
          </motion.h2>
        </div>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-white-1 mb-6 text-center">Get in Touch</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-eerie-black-2 rounded-2xl p-6 text-center border border-jet hover:border-orange-yellow-crayola transition-all duration-300 group"
              >
                <div className="text-orange-yellow-crayola text-3xl mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {detail.icon}
                </div>
                {detail.href ? (
                  <a
                    href={detail.href}
                    className="text-white-1 font-medium hover:text-orange-yellow-crayola transition-colors duration-300"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <span className="text-white-1 font-medium">{detail.value}</span>
                )}
                <p className="text-white-2 text-sm mt-2">{detail.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-white-1 mb-6 text-center">Contact Form</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name *"
                  className={`w-full px-5 py-4 bg-eerie-black-2 border rounded-2xl text-white-1 placeholder-white-2 focus:outline-none focus:border-orange-yellow-crayola transition-colors duration-300 ${
                    errors.name ? 'border-red-500' : 'border-jet'
                  }`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email *"
                  className={`w-full px-5 py-4 bg-eerie-black-2 border rounded-2xl text-white-1 placeholder-white-2 focus:outline-none focus:border-orange-yellow-crayola transition-colors duration-300 ${
                    errors.email ? 'border-red-500' : 'border-jet'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Your Subject *"
                className={`w-full px-5 py-4 bg-eerie-black-2 border rounded-2xl text-white-1 placeholder-white-2 focus:outline-none focus:border-orange-yellow-crayola transition-colors duration-300 ${
                  errors.subject ? 'border-red-500' : 'border-jet'
                }`}
                required
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message *"
                rows={6}
                className={`w-full px-5 py-4 bg-eerie-black-2 border rounded-2xl text-white-1 placeholder-white-2 focus:outline-none focus:border-orange-yellow-crayola transition-colors duration-300 resize-vertical min-h-[120px] max-h-[200px] ${
                  errors.message ? 'border-red-500' : 'border-jet'
                }`}
                required
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                className={`px-8 py-4 bg-gradient-to-r from-orange-yellow-crayola to-orange-yellow-crayola/80 text-smoky-black font-semibold rounded-2xl flex items-center gap-3 mx-auto transition-all duration-300 hover:shadow-lg hover:shadow-orange-yellow-crayola/25 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'animate-pulse' : ''
                }`}
              >
                <IoPaperPlaneOutline className="text-lg" />
                <span>
                  {isSubmitting 
                    ? 'Sending...' 
                    : submitStatus === 'success' 
                    ? 'Message Sent!' 
                    : submitStatus === 'error'
                    ? 'Send Failed'
                    : 'Send Message'
                  }
                </span>
              </motion.button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-500 text-sm mt-4"
              >
                Thank you! Your message has been sent successfully.
              </motion.div>
            )}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-500 text-sm mt-4"
              >
                Sorry, there was an error sending your message. Please try again.
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
