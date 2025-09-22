import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ExclamationTriangleIcon, 
  HomeIcon,
  ChartBarIcon 
} from "@heroicons/react/24/outline";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="w-12 h-12 text-destructive" />
          </div>
          
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <Link to="/" className="btn-primary inline-flex items-center space-x-2 w-full justify-center">
            <HomeIcon className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          
          <Link to="/dashboard" className="btn-outline inline-flex items-center space-x-2 w-full justify-center">
            <ChartBarIcon className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
