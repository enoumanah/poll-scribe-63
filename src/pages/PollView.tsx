import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { pollsAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/ui/Navigation";
import {
  ChartBarIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  visibility: "public" | "private";
  shareLink?: string;
  createdAt: string;
  hasVoted?: boolean;
  userVoteOptionId?: string;
}

interface PollResults {
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
}

const PollView: React.FC = () => {
  const { id, shareLink } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<PollResults | null>(null);

  useEffect(() => {
    fetchPoll();
  }, [id, shareLink]);

  const fetchPoll = async () => {
    try {
      setIsLoading(true);

      let pollData: Poll;
      if (shareLink) {
        pollData = await pollsAPI.getPollByShareLink(shareLink);
      } else if (id) {
        pollData = await pollsAPI.getPoll(id);
      } else {
        throw new Error("No poll identifier provided");
      }

      setPoll(pollData);

      // Always fetch results to get accurate vote counts and percentages
      await fetchResults(pollData.id);

      if (pollData.hasVoted) {
        setShowResults(true);
      }
    } catch (error: any) {
      console.error("Failed to fetch poll:", error);
      if (error.message.includes("401")) {
        toast.error("Please login to view this poll");
        navigate("/login");
      } else if (error.message.includes("404")) {
        toast.error("Poll not found");
        navigate(isAuthenticated ? "/dashboard" : "/");
      } else {
        toast.error("Failed to load poll");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResults = async (pollId: string) => {
    try {
      const resultsData: PollResults = await pollsAPI.getResults(pollId);
      setResults(resultsData);
    } catch (error) {
      console.error("Failed to fetch results:", error);
      toast.error("Failed to fetch poll results");
    }
  };

  const handleVote = async (optionId: string) => {
    if (!poll || !isAuthenticated) {
      toast.error("Please login to vote");
      navigate("/login");
      return;
    }

    setIsVoting(true);

    try {
      await pollsAPI.vote(poll.id, { optionId: optionId });

      // Update poll state to show user has voted
      setPoll((prevPoll) =>
        prevPoll
          ? { ...prevPoll, hasVoted: true, userVoteOptionId: optionId }
          : prevPoll
      );

      // Fetch updated results
      await fetchResults(poll.id);
      setShowResults(true);

      toast.success("Vote submitted successfully!");
    } catch (error: any) {
      console.error("Failed to vote:", error);
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = async () => {
    if (!poll) return;

    const shareUrl =
      poll.visibility === "private" && poll.shareLink
        ? `${window.location.origin}/share/${poll.shareLink}`
        : `${window.location.origin}/polls/${poll.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Poll link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy link");
    }
  };

  // Calculate total votes on the frontend from the results data
  const totalVotes = results
    ? results.options.reduce((sum, option) => sum + option.votes, 0)
    : 0;
  const maxVotes = results
    ? Math.max(...results.options.map((option) => option.votes), 1)
    : 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {isAuthenticated && <Navigation />}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading poll...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-background">
        {isAuthenticated && <Navigation />}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Poll Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The poll you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <Navigation />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
            className="btn-secondary mb-6 inline-flex items-center space-x-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Poll Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card-elevated p-8"
          >
            {/* Poll Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {poll.question}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>
                    {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(poll.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-3 rounded-md hover:bg-accent transition-colors"
                title="Share Poll"
              >
                <ShareIcon className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Voting Interface or Results */}
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="voting"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-6">
                    Choose your answer:
                  </h3>
                  <div className="space-y-4 mb-8">
                    {poll.options.map((option, index) => (
                      <motion.label
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedOption === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="poll-option"
                            value={option.id}
                            checked={selectedOption === option.id}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                            disabled={poll?.hasVoted}
                          />
                          <span className="text-base font-medium">
                            {option.text}
                          </span>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectedOption && handleVote(selectedOption)}
                    disabled={!selectedOption || isVoting || poll?.hasVoted}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed relative"
                  >
                    {isVoting && (
                      <div className="spinner w-4 h-4 absolute left-6"></div>
                    )}
                    <span className={isVoting ? "ml-6" : ""}>
                      {poll?.hasVoted
                        ? "You have already voted"
                        : isVoting
                        ? "Submitting..."
                        : "Submit Vote"}
                    </span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {poll.hasVoted && (
                    <div className="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-200 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                      You have already voted. Here are the poll results.
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mb-6">
                    <ChartBarIcon className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Poll Results</h3>
                    {poll.hasVoted && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="space-y-4">
                    {results?.options.map((option, index) => {
                      const percentage = option.percentage;
                      const isWinning =
                        option.votes === maxVotes && totalVotes > 0;
                      const isUserVote = poll?.userVoteOptionId === option.id;
                      return (
                        <motion.div
                          key={option.text}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`p-4 rounded-lg border ${
                            isUserVote
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{option.text}</span>
                              {isUserVote && (
                                <CheckCircleIcon className="w-4 h-4 text-primary" />
                              )}
                              {isWinning && totalVotes > 0 && (
                                <span className="badge-success">Leading</span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{percentage}%</div>
                              <div className="text-sm text-muted-foreground">
                                {option.votes}{" "}
                                {option.votes === 1 ? "vote" : "votes"}
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className={`h-2 rounded-full ${
                                isUserVote ? "bg-primary" : "bg-primary/70"
                              }`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Share Link for Private Polls */}
            {poll.visibility === "private" && poll.shareLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 p-4 bg-secondary/50 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium mb-1">Shareable Link</h4>
                    <p className="text-sm text-muted-foreground">
                      Share this link to let others vote on your private poll
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-2 rounded-md hover:bg-accent transition-colors"
                    title="Copy Share Link"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PollView;
