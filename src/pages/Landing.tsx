import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import {
  ChartBarIcon,
  PlusIcon,
  ShareIcon,
  UserGroupIcon,
  SunIcon,
  MoonIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: PlusIcon,
      title: 'Create Polls',
      description: 'Build engaging polls with multiple options and custom visibility settings.',
    },
    {
      icon: UserGroupIcon,
      title: 'Real-time Voting',
      description: 'Collect votes instantly with live results and beautiful visualizations.',
    },
    {
      icon: ShareIcon,
      title: 'Share Everywhere',
      description: 'Generate shareable links for public polls or keep them private.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-border">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold gradient-text">PollCreator</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </motion.button>
          
          <Link to="/login" className="btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
          >
            PollCreator
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-4"
          >
            Create and Share Polls Effortlessly
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Build engaging polls, collect instant feedback, and visualize results with beautiful charts. 
            Perfect for teams, educators, and content creators who want to engage their audience.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              className="btn-outline"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-secondary/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Create Amazing Polls
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to create, share, and analyze polls 
              with ease and style.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="card-elevated p-8 text-center"
              >
                <div className="mb-6">
                  <feature.icon className="w-12 h-12 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChartBarIcon className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">PollCreator</span>
            </div>
            
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PollCreator. Built with React, Tailwind CSS, and Framer Motion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;