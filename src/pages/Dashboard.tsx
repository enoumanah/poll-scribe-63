import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle, BarChart2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: Option[];
  ownerUsername: string;
}

const Dashboard = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPolls = async () => {
      if (token) {
        try {
          const fetchedPolls = await pollsAPI.getDashboardPolls();
          setPolls(fetchedPolls);
        } catch (error) {
          console.error('Failed to fetch polls:', error);
          toast({
            title: "Error",
            description: "Failed to load dashboard polls.",
            variant: "destructive",
          })
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [token, toast]);

  const handleDelete = async (pollId: string) => {
    try {
      await pollsAPI.deletePoll(pollId);
      setPolls(polls.filter((poll) => poll.id !== pollId));
      toast({
        title: "Success",
        description: "Poll deleted successfully.",
      })
    } catch (error) {
      console.error('Failed to delete poll:', error);
      toast({
        title: "Error",
        description: "Failed to delete poll.",
        variant: "destructive",
      })
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading polls...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate('/create')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Poll
        </Button>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No polls found!</h2>
          <p className="text-muted-foreground mt-2 mb-4">Click the button above to create your first poll.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id}>
              <CardHeader>
                <CardTitle>{poll.question}</CardTitle>
                <CardDescription>Created by: {poll.ownerUsername}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {poll.options && poll.options.length > 0 ? (
                    poll.options.map((option) => (
                      <li key={option.id} className="flex justify-between items-center text-sm py-1">
                        <span>{option.text}</span>
                        <span className="font-semibold">{option.votes} votes</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No options available for this poll.</li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(`/polls/${poll.id}`)}>
                  <BarChart2 className="mr-2 h-4 w-4" /> View
                </Button>
                
                {user && user.username === poll.ownerUsername && (
                   <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button variant="destructive">
                       <Trash2 className="mr-2 h-4 w-4" /> Delete
                     </Button>
                   </AlertDialogTrigger>
                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                       <AlertDialogDescription>
                         This action cannot be undone. This will permanently delete your poll
                         and remove its data from our servers.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction onClick={() => handleDelete(poll.id)}>Continue</AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;