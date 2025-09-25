import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pollsAPI } from "@/services/api";
import Navigation from "@/components/ui/Navigation";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

interface PollResults {
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
}

const PollResultsView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<PollResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsData: PollResults = await pollsAPI.getResults(id!);
        setResults(resultsData);
      } catch (error) {
        navigate("/notfound");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Results Not Found</h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = results.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );
  const maxVotes = Math.max(
    ...results.options.map((option) => option.votes),
    1
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-secondary mb-6 inline-flex items-center space-x-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card-elevated p-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {results.question}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-8">
              <span>
                {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <ChartBarIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Poll Results</h3>
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              {results.options.map((option, index) => {
                const percentage = option.percentage;
                const isWinning = option.votes === maxVotes && totalVotes > 0;
                return (
                  <motion.div
                    key={option.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      isWinning
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{option.text}</span>
                        {isWinning && totalVotes > 0 && (
                          <span className="badge-success">Leading</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{percentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {option.votes} {option.votes === 1 ? "vote" : "votes"}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-2 rounded-full bg-primary"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PollResultsView;
