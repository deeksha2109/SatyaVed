import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      info: "info@satyaved.com",
      description: "Get in touch for any questions or suggestions"
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+91 98765 43210",
      description: "Available Monday to Friday, 9 AM - 6 PM IST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "Mumbai, India",
      description: "Our headquarters in the cultural capital"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-6" style={{ fontFamily: 'Cinzel' }}>
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-golden-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Have a story to share? Questions about our mission? We'd love to hear from you. 
            Let's work together to preserve cultural heritage for future generations.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-golden-100 dark:border-gray-700 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-golden-600 text-white rounded-xl mb-6">
                <info.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {info.title}
              </h3>
              <p className="text-golden-600 dark:text-golden-400 font-semibold mb-2">
                {info.info}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {info.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gradient-to-br from-cream-50 to-golden-50 dark:from-gray-800 dark:to-gray-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <MessageCircle className="mx-auto text-golden-600 mb-4" size={48} />
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" style={{ fontFamily: 'Cinzel' }}>
                Send Us a Message
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We're always excited to hear from fellow culture enthusiasts and storytellers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-xl border border-golden-100 dark:border-gray-700"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-300"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-300 resize-vertical"
                    placeholder="Tell us your story, ask a question, or share your thoughts..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-golden-600 to-golden-700 text-white font-semibold rounded-xl hover:from-golden-700 hover:to-golden-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Send Message
                    <Send className="ml-2" size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" style={{ fontFamily: 'Cinzel' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Quick answers to common questions about Satyaved and cultural myth preservation
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "How can I contribute my family's myths and stories?",
                answer: "Simply create an account and use our submission form. Our expert reviewers will help ensure your stories are preserved accurately while respecting cultural sensitivities."
              },
              {
                question: "Are the myths on Satyaved verified for authenticity?",
                answer: "We work with cultural experts and scholars to verify the authenticity and cultural significance of each myth. Community feedback also helps us maintain accuracy."
              },
              {
                question: "Can I edit or delete my submitted stories?",
                answer: "Yes, you have full control over your submissions. You can edit, update, or remove your stories at any time through your dashboard."
              },
              {
                question: "How do you handle cultural sensitivity?",
                answer: "Cultural sensitivity is paramount to us. We have guidelines and expert reviewers to ensure all content respects the traditions and beliefs of different cultures."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-golden-100 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;