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
  optionId: number;
}

// Authentication token management
export const tokenManager = {
  getToken: (): string | null => localStorage.getItem('authToken'),
  setToken: (token: string): void => localStorage.setItem('authToken', token),
  removeToken: (): void => localStorage.removeItem('authToken'),
  isAuthenticated: (): boolean => !!localStorage.getItem('authToken')
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
    
    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      tokenManager.removeToken();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    // Handle other error statuses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle empty responses
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
  async login(credentials: AuthData): Promise<{ token: string; user: any }> {
    const response = await apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    tokenManager.setToken(response.token);
    return response;
  },

  async register(userData: AuthData): Promise<{ token: string; user: any }> {
    const response = await apiRequest<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    tokenManager.setToken(response.token);
    return response;
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
  }
};

export default { authAPI, pollsAPI, tokenManager };