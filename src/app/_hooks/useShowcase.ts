import { useState, useCallback } from 'react';

interface ShowcaseProject {
    id: string;
    title: string;
    author: string;
    authorRole?: string;
    authorId: string;
    location: string;
    image: string;
    avatarUrl?: string;
    likes: number;
    views: number;
    saves: number;
    sdgTags: string[];
    techTags: string[];
    description: string;
    createdAt: string;
    featured: boolean;
    aiMatchScore: number;
    githubUrl?: string;
    demoUrl?: string;
    status: string;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface ShowcaseProjectInput {
    title: string;
    description: string;
    imageUrl?: string;
    sdgTags?: string[];
    techTags?: string[];
    githubUrl?: string;
    demoUrl?: string;
    status?: string;
}

interface CreateProjectResult {
    success: boolean;
    project?: ShowcaseProject;
    error?: string;
    message?: string;
    violations?: string[];
    severity?: string;
}

export default function useShowcase() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<ShowcaseProject[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    const fetchProjects = useCallback(async ({
        search = '',
        filter = 'all',
        sdg = 'all',
        page = 1,
        limit = 9,
        sortBy = 'newest',
        userId = '', // Add userId parameter for filtering user's projects
        status = 'PUBLISHED', // Add status parameter
    } = {}) => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
            search,
            filter,
            sdg,
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            status,
        });

        // Add userId if provided
        if (userId) {
            params.append('userId', userId);
        }

        try {
            const res = await fetch(`/api/showcase?${params.toString()}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch projects');

            setProjects(data.projects);
            setPagination(data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = useCallback(async (projectData: ShowcaseProjectInput): Promise<CreateProjectResult> => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/showcase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify(projectData),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle content moderation errors specifically
                if (data.error === 'Content moderation failed' || data.error === 'Image filename contains inappropriate content') {
                    return {
                        success: false,
                        error: 'content_moderation',
                        message: data.message,
                        violations: data.violations,
                        severity: data.severity
                    };
                }
                
                throw new Error(data.error || 'Failed to create project');
            }

            // Optional: refresh the list or add the new project
            return { success: true, project: data.project };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProject = useCallback(async (projectId: string, userId: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/showcase/${projectId}?userId=${userId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to delete project');

            // Remove the deleted project from the current list
            setProjects(prev => prev.filter(project => project.id !== projectId));

            return { success: true, message: data.message };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const resetState = () => {
        setProjects([]);
        setPagination(null);
        setError(null);
    };

    return {
        loading,
        error,
        projects,
        pagination,
        fetchProjects,
        createProject,
        deleteProject,
        resetState
    };
}
