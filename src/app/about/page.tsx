// app/about/page.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// Value item type
type ValueItem = {
  icon: string;
  title: string;
  description: string;
};

// Team member type
type TeamMember = {
  name: string;
  role: string;
  imagePath: string;
};

// Stat item type
type StatItem = {
  count: string;
  label: string;
};

export default function AboutUs() {
  // Our values data
  const values: ValueItem[] = [
    {
      icon: "🔍",
      title: "Quality Assurance",
      description: "We select only the finest electronics products to ensure reliability and performance."
    },
    {
      icon: "💡",
      title: "Innovation",
      description: "We continuously seek the latest technology to keep our catalog cutting-edge."
    },
    {
      icon: "🤝",
      title: "Customer First",
      description: "Your satisfaction is our priority with responsive support and honest advice."
    }
  ];

  // Team members data
  const team: TeamMember[] = [
    {
      name: "Shania Azzahra",
      role: "Founder",
      imagePath: "/images/team/alex.jpg"
    },
    {
      name: "Dzaky Athariq Ferreira",
      role: "Founder",
      imagePath: "/images/team/sarah.jpg"
    },
    {
        name: "Mirza",
        role: "Founder",
        imagePath: "/images/team/sarah.jpg"
      },
  ];

  // Stats data
  const stats: StatItem[] = [
    { count: "5+", label: "Years of Experience" },
    { count: "10,000+", label: "Happy Customers" },
    { count: "1,500+", label: "Products" },
    { count: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="relative h-80 sm:h-96 md:h-[400px] lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <Image 
            src="/images/tech-background.jpg" 
            alt="Technology Background"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              About TechElite
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              Your trusted destination for premium electronics and cutting-edge technology.
            </p>
            <div className="space-x-4">
              <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 inline-block">
                Explore Products
              </Link>
              <Link href="#our-story" className="bg-transparent hover:bg-white/10 text-white border border-white font-medium py-2 px-6 rounded-lg transition duration-300 inline-block">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeIn} 
              className="text-3xl font-bold mb-4"
            >
              Our Story
            </motion.h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeIn} 
              className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl"
            >
              <Image 
                src="/images/foundation.jpg" 
                alt="TechElite Foundation"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeIn}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-blue-400">From Passion to Excellence</h3>
              <p className="text-gray-300 mb-4">
                Founded in 2018, TechElite began with a simple mission: to make premium technology accessible to everyone. What started as a small online store has grown into one of the most trusted electronics retailers in the region.
              </p>
              <p className="text-gray-300">
                Our journey is driven by a passion for innovation and exceptional customer service. We believe that everyone deserves access to high-quality electronics that enhance their lives.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeIn} 
              className="text-3xl font-bold mb-4"
            >
              Our Values
            </motion.h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer} 
            className="grid sm:grid-cols-3 gap-6"
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn} 
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-blue-400">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-800">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <motion.h2 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={fadeIn} 
        className="text-3xl font-bold mb-4 text-white"
      >
        Meet Our Team
      </motion.h2>
      <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
    </div>

    {/* Wrapper flex agar grid tetap di tengah */}
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={staggerContainer} 
      className="flex justify-center"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {team.map((member, index) => (
          <motion.div 
            key={index} 
            variants={fadeIn} 
            className="bg-gray-900 rounded-lg overflow-hidden shadow-lg group"
          >
            <div className="relative h-64 overflow-hidden">
              <Image 
                src={member.imagePath} 
                alt={member.name}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-white">{member.name}</h3>
              <p className="text-blue-400">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
</section>


      {/* Stats Section */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={fadeIn} 
                className="text-center p-4 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold mb-2 text-blue-400">{stat.count}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeIn}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Experience TechElite Today</h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Discover our premium electronics selection or reach out for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/products" className="bg-white text-gray-900 hover:bg-gray-200 font-bold py-2 px-6 rounded-lg transition duration-300 inline-block">
                Shop Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}