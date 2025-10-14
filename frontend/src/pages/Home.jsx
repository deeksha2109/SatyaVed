import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-golden-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1
            className="text-5xl font-bold text-gray-800 dark:text-white mb-6"
            style={{ fontFamily: "Cinzel" }}
          >
            Welcome to <span className="text-golden-600">SatyaVed</span>
          </h1>
          <div className="w-24 h-1 bg-golden-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            A modern way to explore timeless wisdom.  
            Discover ancient myths, cultural traditions, and their hidden meanings — 
            all in one beautiful place.
          </p>

          <div className="mt-10 flex justify-center gap-6 flex-wrap">
            <Link
              to="/myths"
              className="px-6 py-3 bg-golden-600 text-white rounded-xl hover:bg-golden-700 transition-colors duration-300"
            >
              Explore Myths
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 border-2 border-golden-600 text-golden-600 rounded-xl hover:bg-golden-50 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
            style={{ fontFamily: "Cinzel" }}
          >
            What You Can Discover
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            SatyaVed is more than a website — it’s a journey into culture, 
            stories, and traditions that shape who we are.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Ancient Wisdom",
              desc: "Learn the origin of popular cultural beliefs and practices.",
              icon: "📜",
            },
            {
              title: "Interactive Search",
              desc: "Quickly find myths by category or keyword with ease.",
              icon: "🔎",
            },
            {
              title: "Cultural Insights",
              desc: "Understand why these traditions were formed and their relevance today.",
              icon: "🌏",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-golden-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-golden-600 text-white py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Cinzel" }}>
            Start Your Journey
          </h2>
          <p className="text-lg mb-6">
            Dive into a curated collection of myths and traditions — designed 
            to inspire curiosity and deepen cultural connection.
          </p>
          <Link
            to="/myths"
            className="px-8 py-3 bg-white text-golden-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300"
          >
            Explore Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
