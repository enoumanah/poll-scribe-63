import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ChartBarIcon, 
  ArrowLeftIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Privacy: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-border">
        <Link to="/" className="flex items-center space-x-2">
          <ChartBarIcon className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold gradient-text">PollCreator</span>
        </Link>
        
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
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 max-w-4xl"
      >
        {/* Back Button */}
        <Link to="/" className="btn-secondary mb-8 inline-flex items-center space-x-2">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card-elevated p-8"
        >
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to PollCreator. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our polling platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Account Information</h3>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your username, email address, and encrypted password.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Poll Data</h3>
                  <p className="text-muted-foreground">
                    We store the polls you create, including questions, options, and voting results. Private polls 
                    are only accessible via secure share links.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Usage Information</h3>
                  <p className="text-muted-foreground">
                    We may collect information about how you interact with our platform to improve our services.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>To provide and maintain our polling services</li>
                <li>To authenticate your account and secure your data</li>
                <li>To enable poll creation, sharing, and voting functionality</li>
                <li>To communicate with you about your account or our services</li>
                <li>To improve and optimize our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized 
                access, alteration, disclosure, or destruction. This includes encryption of sensitive data and 
                secure authentication protocols.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without 
                your consent, except as described in this policy. Public poll results may be visible to all users, 
                while private polls are only accessible via secure share links.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access and update your account information</li>
                <li>Delete your polls and account data</li>
                <li>Control the visibility of your polls (public/private)</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cookies and Local Storage</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use local storage to maintain your login session and remember your theme preferences. 
                No tracking cookies are used for advertising purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us through 
                our GitHub repository or via the contact information provided on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Privacy;