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
  TrashIcon,
  ClipboardDocumentIcon,
  GlobeAltIcon,
  LockClosedIcon
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

const Dashboard: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      const data = await pollsAPI.getDashboardPolls();
      console.log('Dashboard polls data:', data); // Debug log
      setPolls(data);
    } catch (error: any) {
      console.error('Failed to fetch polls:', error);
      toast.error('Failed to load polls');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePoll = async (pollId: string, pollQuestion: string) => {
    if (!confirm(`Are you sure you want to delete "${pollQuestion}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingPollId(pollId);
      await pollsAPI.deletePoll(pollId);
      setPolls(polls.filter(poll => poll.id !== pollId));
      toast.success('Poll deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete poll:', error);
      toast.error('Failed to delete poll');
    } finally {
      setDeletingPollId(null);
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
              <p className="text-muted-foreground">Loading your polls...</p>
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
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Explore public polls and manage your private polls
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
                <PlusIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">No polls to show yet</h3>
              <p className="text-muted-foreground mb-6">
                No polls to show yet. Create one!
              </p>
              <Link to="/create" className="btn-primary inline-flex items-center space-x-2">
                <PlusIcon className="w-4 h-4" />
                <span>Create Your First Poll</span>
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
              {polls.map((poll) => {
                // Debug each poll's visibility
                console.log(`Poll "${poll.question}" visibility:`, poll.visibility);
                
                return (
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

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeletePoll(poll.id, poll.question)}
                      disabled={deletingPollId === poll.id}
                      className="p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
                      title="Delete Poll"
                    >
                      {deletingPollId === poll.id ? (
                        <div className="spinner w-4 h-4"></div>
                      ) : (
                        <TrashIcon className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                 </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;