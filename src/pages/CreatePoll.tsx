import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { pollsAPI } from '@/services/api';
import Navigation from '@/components/ui/Navigation';
import {
  PlusIcon,
  MinusIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const CreatePoll: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    visibility: 'public' as 'public' | 'private',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.question.trim()) {
      toast.error('Please enter a poll question');
      return;
    }

    const validOptions = formData.options.filter(option => option.trim());
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 poll options');
      return;
    }

    if (formData.question.length > 255) {
      toast.error('Question must be 255 characters or less');
      return;
    }

    setIsLoading(true);

    try {
      const pollData = {
        question: formData.question.trim(),
        options: validOptions,
        visibility: formData.visibility,
      };

      const result = await pollsAPI.createPoll(pollData);
      
      toast.success('Poll created successfully!');
      
      // Show share link for private polls
      if (formData.visibility === 'private' && result.shareLink) {
        const shareUrl = `${window.location.origin}/share/${result.shareLink}`;
        toast.info(`Share link: ${shareUrl}`, {
          autoClose: 10000,
        });
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Failed to create poll:', error);
      
      if (error.message.includes('400')) {
        toast.error('Please check your input and try again');
      } else {
        toast.error('Failed to create poll. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      question: e.target.value,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({
        ...formData,
        options: [...formData.options, ''],
      });
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        options: newOptions,
      });
    }
  };

  const handleVisibilityChange = (visibility: 'public' | 'private') => {
    setFormData({
      ...formData,
      visibility,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Create New Poll</h1>
            <p className="text-muted-foreground">
              Build an engaging poll to collect opinions and feedback
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card-elevated p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Question Input */}
              <div>
                <label htmlFor="question" className="block text-sm font-medium mb-2">
                  Poll Question *
                </label>
                <textarea
                  id="question"
                  value={formData.question}
                  onChange={handleQuestionChange}
                  className="input-field resize-none"
                  rows={3}
                  maxLength={255}
                  placeholder="What would you like to ask?"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    Make your question clear and engaging
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formData.question.length}/255
                  </span>
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium mb-4">
                  Poll Options * (2-10 options)
                </label>
                <div className="space-y-3">
                  <AnimatePresence>
                    {formData.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="input-field flex-1"
                          placeholder={`Option ${index + 1}`}
                          maxLength={100}
                        />
                        
                        {formData.options.length > 2 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {formData.options.length < 10 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={addOption}
                    className="mt-4 btn-outline inline-flex items-center space-x-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Option</span>
                  </motion.button>
                )}
              </div>

              {/* Visibility Settings */}
              <div>
                <label className="block text-sm font-medium mb-4">
                  Poll Visibility
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleVisibilityChange('public')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.visibility === 'public'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <GlobeAltIcon className="w-5 h-5 text-primary" />
                      <span className="font-medium">Public</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Anyone can find and vote on this poll
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleVisibilityChange('private')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.visibility === 'private'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <LockClosedIcon className="w-5 h-5 text-primary" />
                      <span className="font-medium">Private</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Only people with the link can access this poll
                    </p>
                  </motion.button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative min-w-[140px]"
                >
                  {isLoading && (
                    <div className="spinner w-4 h-4 absolute left-4"></div>
                  )}
                  <span className={isLoading ? 'ml-6' : ''}>
                    {isLoading ? 'Creating...' : 'Create Poll'}
                  </span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePoll;