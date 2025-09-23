import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { pollsAPI } from '@/services/api';
import Navigation from '@/components/ui/Navigation';
import {
  PlusIcon,
  EyeIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

interface Poll {
  id: string;
  question: string;
  options: Array<{ id: string; text: string; voteCount: number }>;
  visibility: 'public' | 'private';
  shareLink?: string;
  createdAt: string;
  totalVotes: number;
  ownerUsername: string;
}

const MyActivity: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivityPolls();
  }, []);

  const fetchActivityPolls = async () => {
    try {
      setIsLoading(true);
      const data = await pollsAPI.getUserActivityPolls();
      setPolls(data);
    } catch (error: any) {
      console.error('Failed to fetch activity polls:', error);
      toast.error('Failed to load activity polls');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSharePoll = async (poll: Poll) => {
    const shareUrl = poll.visibility === 'private' && poll.shareLink
      ? `${window.location.origin}/share/${poll.shareLink}`
      : `${window.location.origin}/polls/${poll.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Poll link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your activity...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <ChartPieIcon className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">My Activity</h1>
            </div>
            <p className="text-muted-foreground">
              Polls you've interacted with and participated in
            </p>
          </div>
          
          <Link to="/create" className="btn-primary mt-4 sm:mt-0 inline-flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>Create New Poll</span>
          </Link>
        </div>

        {/* Polls Grid */}
        {polls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="card-elevated p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ChartPieIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">No activity yet</h3>
              <p className="text-muted-foreground mb-6">
                Start participating in polls to see your activity here. Browse the dashboard to find polls to vote on.
              </p>
              <Link to="/dashboard" className="btn-primary inline-flex items-center space-x-2">
                <EyeIcon className="w-4 h-4" />
                <span>Browse Polls</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {polls.map((poll) => (
                <motion.div
                  key={poll.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -5 }}
                  className="card-elevated p-6 group"
                >
                  {/* Poll Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {poll.question}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {poll.visibility === 'public' ? (
                          <div className="flex items-center space-x-1">
                            <GlobeAltIcon className="w-4 h-4" />
                            <span className="badge-success">Public</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <LockClosedIcon className="w-4 h-4" />
                            <span className="badge-private">Private</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Poll Options */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Options:</h4>
                    <div className="space-y-1">
                      {poll.options.map((option, index) => (
                        <div key={option.id} className="text-sm p-2 bg-secondary/20 rounded-md">
                          {option.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      Created by: <span className="font-medium text-foreground">{poll.ownerUsername}</span>
                    </p>
                  </div>

                  {/* Poll Stats */}
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(poll.createdAt)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex space-x-2">
                      <Link
                        to={`/polls/${poll.id}`}
                        className="p-2 rounded-md hover:bg-accent transition-colors group"
                        title="View Poll"
                      >
                        <EyeIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </Link>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSharePoll(poll)}
                        className="p-2 rounded-md hover:bg-accent transition-colors group"
                        title="Share Poll"
                      >
                        <ShareIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </motion.button>

                      {poll.visibility === 'private' && poll.shareLink && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSharePoll(poll)}
                          className="p-2 rounded-md hover:bg-accent transition-colors group"
                          title="Copy Share Link"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MyActivity;