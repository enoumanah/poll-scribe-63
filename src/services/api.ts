const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://poll-api-7doi.onrender.com/api';

interface AuthData {
  username: string;
  password: string;
  email?: string;
}

interface PollData {
  question: string;
  options: string[];
  visibility: 'public' | 'private';
}

interface VoteData {
  optionId: string;
}

// *** DEFINE THE CORRECT API RESPONSE TYPE ***
interface AuthResponse {
  token: string;
  username: string;
}


// Authentication token management
export const tokenManager = {
  getToken: (): string | null => localStorage.getItem('authToken'),
  setToken: (token: string): void => localStorage.setItem('authToken', token),
  removeToken: (): void => localStorage.removeItem('authToken'),
};

// API request helper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenManager.getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      tokenManager.removeToken();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response.text() as unknown as T;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  // *** UPDATE THE RETURN TYPE TO MATCH THE BACKEND ***
  async login(credentials: AuthData): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // *** UPDATE THE RETURN TYPE TO MATCH THE BACKEND ***
  async register(userData: AuthData): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout(): void {
    tokenManager.removeToken();
  }
};

// Polls API
export const pollsAPI = {
  async getPolls(): Promise<any[]> {
    return apiRequest<any[]>('/polls');
  },

  async getPoll(id: string): Promise<any> {
    return apiRequest<any>(`/polls/${id}`);
  },

  async getPollByShareLink(shareLink: string): Promise<any> {
    return apiRequest<any>(`/polls/share/${shareLink}`);
  },

  async createPoll(pollData: PollData): Promise<any> {
    return apiRequest<any>('/polls', {
      method: 'POST',
      body: JSON.stringify(pollData),
    });
  },

  async deletePoll(id: string): Promise<void> {
    return apiRequest<void>(`/polls/${id}`, {
      method: 'DELETE',
    });
  },

  async vote(id: string, voteData: VoteData): Promise<any> {
    return apiRequest<any>(`/polls/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  },

  async getResults(id: string): Promise<any> {
    return apiRequest<any>(`/polls/${id}/results`);
  },

  async getDashboardPolls(): Promise<any[]> {
    return apiRequest<any[]>('/polls/dashboard');
  },

  async getUserActivityPolls(): Promise<any[]> {
    return apiRequest<any[]>('/polls/user-activity');
  }
};
