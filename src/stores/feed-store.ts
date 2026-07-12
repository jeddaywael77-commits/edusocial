/**
 * @deprecated This store will be replaced by React Query hooks in Phase 4.
 * Keep until @/features/posts/ hooks are fully implemented and tested.
 */
import { create } from "zustand";
import { Post, Story } from "@/types";

interface FeedState {
  posts: Post[];
  stories: Story[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  addPost: (post: Post) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, comment: Post["comments"][0]) => void;
  loadMore: () => void;
  setPosts: (posts: Post[]) => void;
  setStories: (stories: Story[]) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  stories: [],
  isLoading: false,
  hasMore: true,
  page: 1,

  addPost: (post) =>
    set((state) => ({ posts: [post, ...state.posts] })),

  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      ),
    })),

  toggleSave: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, isSaved: !p.isSaved } : p
      ),
    })),

  addComment: (postId, comment) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, comment], commentsCount: p.commentsCount + 1 }
          : p
      ),
    })),

  loadMore: () =>
    set((state) => ({ page: state.page + 1 })),

  setPosts: (posts) => set({ posts }),

  setStories: (stories) => set({ stories }),
}));
