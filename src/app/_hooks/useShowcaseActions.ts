import { useState, useCallback, useEffect } from 'react';

interface ShowcaseActionsState {
  likes: { [projectId: string]: boolean };
  bookmarks: { [projectId: string]: boolean };
  likeCounts: { [projectId: string]: number };
  bookmarkCounts: { [projectId: string]: number };
}

const STORAGE_KEY = 'staygrow_showcase_actions';

export const useShowcaseActions = () => {
  const [state, setState] = useState<ShowcaseActionsState>({
    likes: {},
    bookmarks: {},
    likeCounts: {},
    bookmarkCounts: {}
  });
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          likes: parsedState.likes || {},
          bookmarks: parsedState.bookmarks || {}
        }));
      }
    } catch (error) {
      console.error('Error loading stored showcase actions:', error);
    }
    setInitialized(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (initialized) {
      try {
        const stateToStore = {
          likes: state.likes,
          bookmarks: state.bookmarks
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
      } catch (error) {
        console.error('Error saving showcase actions to storage:', error);
      }
    }
  }, [state.likes, state.bookmarks, initialized]);

  // Fetch user states from server for given project IDs
  const fetchUserStates = useCallback(async (projectIds: string[]) => {
    if (projectIds.length === 0) return;
    
    try {
      const response = await fetch('/api/showcase/user-states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectIds })
      });

      if (response.ok) {
        const data = await response.json();
        setState(prev => ({
          ...prev,
          likes: { ...prev.likes, ...data.likes },
          bookmarks: { ...prev.bookmarks, ...data.bookmarks }
        }));
      }
    } catch (error) {
      console.error('Error fetching user states:', error);
    }
  }, []);

  const toggleLike = async (projectId: string, currentLikes: number) => {
    if (loading[`like-${projectId}`]) return;
    
    setLoading(prev => ({ ...prev, [`like-${projectId}`]: true }));
    
    const isLiked = state.likes[projectId];
    const newLikeStatus = !isLiked;
    const newLikeCount = newLikeStatus ? currentLikes + 1 : currentLikes - 1;
    
    try {
      // Optimistic update
      setState(prev => ({
        ...prev,
        likes: { ...prev.likes, [projectId]: newLikeStatus },
        likeCounts: { ...prev.likeCounts, [projectId]: newLikeCount }
      }));

      // API call
      const response = await fetch(`/api/showcase/${projectId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newLikeStatus ? 'like' : 'unlike' })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      
      // Update with actual server data
      setState(prev => ({
        ...prev,
        likes: { ...prev.likes, [projectId]: data.isLiked },
        likeCounts: { ...prev.likeCounts, [projectId]: data.totalLikes }
      }));

    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update
      setState(prev => ({
        ...prev,
        likes: { ...prev.likes, [projectId]: isLiked },
        likeCounts: { ...prev.likeCounts, [projectId]: currentLikes }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [`like-${projectId}`]: false }));
    }
  };

  const toggleBookmark = async (projectId: string, currentBookmarks: number) => {
    if (loading[`bookmark-${projectId}`]) return;
    
    setLoading(prev => ({ ...prev, [`bookmark-${projectId}`]: true }));
    
    const isBookmarked = state.bookmarks[projectId];
    const newBookmarkStatus = !isBookmarked;
    const newBookmarkCount = newBookmarkStatus ? currentBookmarks + 1 : currentBookmarks - 1;
    
    try {
      // Optimistic update
      setState(prev => ({
        ...prev,
        bookmarks: { ...prev.bookmarks, [projectId]: newBookmarkStatus },
        bookmarkCounts: { ...prev.bookmarkCounts, [projectId]: newBookmarkCount }
      }));

      // API call
      const response = await fetch(`/api/showcase/${projectId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newBookmarkStatus ? 'bookmark' : 'unbookmark' })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle bookmark');
      }

      const data = await response.json();
      
      // Update with actual server data
      setState(prev => ({
        ...prev,
        bookmarks: { ...prev.bookmarks, [projectId]: data.isBookmarked },
        bookmarkCounts: { ...prev.bookmarkCounts, [projectId]: data.totalBookmarks }
      }));

    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert optimistic update
      setState(prev => ({
        ...prev,
        bookmarks: { ...prev.bookmarks, [projectId]: isBookmarked },
        bookmarkCounts: { ...prev.bookmarkCounts, [projectId]: currentBookmarks }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [`bookmark-${projectId}`]: false }));
    }
  };

  const shareProject = async (project: { id: string; title: string; author: string }) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${project.title} - StayGrow Showcase`,
          text: `Lihat proyek inovatif "${project.title}" oleh ${project.author} di StayGrow!`,
          url: `${window.location.origin}/home/showcase/${project.id}`
        });
      } else {
        // Fallback to copying to clipboard
        const shareUrl = `${window.location.origin}/home/showcase/${project.id}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('Link proyek berhasil disalin ke clipboard!');
      }
    } catch (error) {
      console.error('Error sharing project:', error);
      // Fallback: copy to clipboard
      try {
        const shareUrl = `${window.location.origin}/home/showcase/${project.id}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('Link proyek berhasil disalin ke clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        alert('Gagal membagikan proyek. Silakan coba lagi.');
      }
    }
  };

  const viewProject = async (projectId: string) => {
    try {
      console.log('ViewProject called with projectId:', projectId);
      
      // Track view
      const trackResponse = await fetch(`/api/showcase/${projectId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Track view response:', trackResponse.status);
      
      // Navigate to project detail
      const targetUrl = `/home/showcase/${projectId}`;
      console.log('Navigating to:', targetUrl);
      window.location.href = targetUrl;
    } catch (error) {
      console.error('Error tracking view:', error);
      // Still navigate even if tracking fails
      const fallbackUrl = `/home/showcase/${projectId}`;
      console.log('Fallback navigation to:', fallbackUrl);
      window.location.href = fallbackUrl;
    }
  };

  const initializeProjectState = useCallback((projectId: string, initialData: {
    isLiked?: boolean;
    isBookmarked?: boolean;
    likes: number;
    bookmarks: number;
  }) => {
    setState(prev => ({
      ...prev,
      likes: { ...prev.likes, [projectId]: initialData.isLiked || false },
      bookmarks: { ...prev.bookmarks, [projectId]: initialData.isBookmarked || false },
      likeCounts: { ...prev.likeCounts, [projectId]: initialData.likes },
      bookmarkCounts: { ...prev.bookmarkCounts, [projectId]: initialData.bookmarks }
    }));
  }, []);

  return {
    // State
    likes: state.likes,
    bookmarks: state.bookmarks,
    likeCounts: state.likeCounts,
    bookmarkCounts: state.bookmarkCounts,
    loading,
    
    // Actions
    toggleLike,
    toggleBookmark,
    shareProject,
    viewProject,
    initializeProjectState,
    fetchUserStates
  };
};
