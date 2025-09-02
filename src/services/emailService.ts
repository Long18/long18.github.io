// Email service configuration using EmailJS
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_hof5kws',
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_o63z3uu',
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'gbVl4O36WE4Wu7zua',
};

export interface EmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const sendContactEmail = async (data: EmailData): Promise<string> => {
    try {
        // Check if EmailJS is properly configured
        if (
            !EMAILJS_CONFIG.serviceId ||
            !EMAILJS_CONFIG.templateId ||
            !EMAILJS_CONFIG.publicKey ||
            EMAILJS_CONFIG.serviceId === 'service_contact_form' ||
            EMAILJS_CONFIG.templateId === 'template_contact_form' ||
            EMAILJS_CONFIG.publicKey === 'your_public_key_here'
        ) {
            throw new Error('EmailJS not configured');
        }

        // Initialize EmailJS with public key
        emailjs.init(EMAILJS_CONFIG.publicKey);

        // Prepare template parameters
        // Note: recipient email should be configured directly in EmailJS template
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            reply_to: data.email,
            // Common alternative parameter names for EmailJS templates
            user_name: data.name,
            user_email: data.email,
            user_message: data.message,
        };

        // Send email with timeout
        await Promise.race([
            emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            ),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('EmailJS timeout')), 10000)
            )
        ]);

        return 'Email sent successfully!';
    } catch (error) {
        throw error;
    }
};

// For development/testing - you can update these once you have your EmailJS account
export const updateEmailJSConfig = (serviceId: string, templateId: string, publicKey: string) => {
    EMAILJS_CONFIG.serviceId = serviceId;
    EMAILJS_CONFIG.templateId = templateId;
    EMAILJS_CONFIG.publicKey = publicKey;
};
