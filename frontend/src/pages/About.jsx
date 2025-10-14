import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Globe, Award, Clock } from 'lucide-react';

const About = () => {
  const timelineEvents = [
    {
      year: "Ancient Times",
      title: "Oral Traditions Begin",
      description: "Stories passed down through generations by word of mouth"
    },
    {
      year: "Classical Period",
      title: "Written Records",
      description: "Myths documented in scriptures and manuscripts"
    },
    {
      year: "Modern Era",
      title: "Cultural Revival",
      description: "Renewed interest in preserving traditional knowledge"
    },
    {
      year: "2025",
      title: "Satyaved Launch",
      description: "Digital platform for myth preservation and sharing"
    }
  ];

  const stats = [
    { icon: BookOpen, number: "1000+", label: "Myths Collected" },
    { icon: Users, number: "500+", label: "Contributors" },
    { icon: Globe, number: "25+", label: "Cultures Represented" },
    { icon: Award, number: "50+", label: "Expert Reviewers" }
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
            About Satyaved
          </h1>
          <div className="w-24 h-1 bg-golden-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Satyaved is more than just a platform—it's a movement to preserve, understand, and celebrate 
            the rich tapestry of human culture through the timeless art of storytelling.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-br from-cream-50 to-golden-50 dark:from-gray-800 dark:to-gray-700 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Ancient manuscripts"
                className="rounded-2xl shadow-lg"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6" style={{ fontFamily: 'Cinzel' }}>
                Our Mission
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-golden-600 rounded-full flex items-center justify-center">
                    <Heart size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Preserve Cultural Heritage</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Document and safeguard traditional stories before they're lost to time
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-maroon-600 rounded-full flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Build Community</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Connect storytellers and culture enthusiasts from around the world
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Share Knowledge</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Make ancient wisdom accessible to modern generations
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4" style={{ fontFamily: 'Cinzel' }}>
              Journey of Myth Preservation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From ancient oral traditions to modern digital preservation
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-golden-300 dark:bg-golden-600"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-end pr-8' : 'justify-start pl-8'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-golden-600 rounded-full border-4 border-white dark:border-gray-800 z-10"></div>
                  
                  {/* Content */}
                  <div className={`max-w-md ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-golden-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock size={16} className="text-golden-600" />
                        <span className="text-golden-600 font-semibold">{event.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-maroon-800 dark:bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Cinzel' }}>
              Our Impact
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              Together, we're building the world's largest collection of cultural myths and stories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-golden-600 rounded-xl mb-4">
                  <stat.icon size={32} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6" style={{ fontFamily: 'Cinzel' }}>
              Our Vision for the Future
            </h2>
            <div className="w-24 h-1 bg-golden-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              We envision a world where cultural knowledge flows freely across generations and borders, 
              where ancient wisdom guides modern decisions, and where every story finds its voice. 
              Through technology and community, we're creating a living library of human experience 
              that will inspire and educate for centuries to come.
            </p>
            <div className="bg-gradient-to-r from-golden-50 to-cream-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl">
              <p className="text-lg italic text-gray-700 dark:text-gray-300">
                "The stories we tell today become the wisdom of tomorrow. At Satyaved, 
                we believe every myth carries a seed of truth that can flourish in the hearts 
                of future generations."
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;