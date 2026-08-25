import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Post, User, FilterCategory } from '../types';
import { MasonryGrid } from './MasonryGrid';

interface SearchTabProps {
  posts: Post[];
  currentUser: User | null;
  likedPostIds: string[];
  followedUserIds: string[];
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onCardClick: (post: Post) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CATEGORIES: FilterCategory[] = [
  'All',
  'Minimalist',
  'Botanical',
  'Characters',
  'Architecture',
  'Animals',
  'Abstract',
  'Daily Life',
];

const POPULAR_SEARCHES = [
  'Cat',
  'Coffee',
  'Architecture',
  'Astronaut',
  'Botanical',
  'Camera',
  'Ramen',
];

export const SearchTab: React.FC<SearchTabProps> = ({
  posts,
  currentUser,
  likedPostIds,
  followedUserIds,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'following'>('latest');

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by text search (title, username, or description/tags)
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.userName.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.tags && p.tags.includes(selectedCategory)
      );
    }

    // Filter by Sort
    if (sortBy === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'following') {
      result = result.filter((p) => followedUserIds.includes(p.userId));
    } else {
      // Latest
      result.sort((a, b) => b.timestamp - a.timestamp);
    }

    return result;
  }, [posts, searchQuery, selectedCategory, sortBy, followedUserIds]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-5">
      
      {/* Search Input Bar (Mobile & dedicated) */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          id="search-tab-input"
          type="text"
          placeholder="Search doodles by title, creator, or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-gray-100 focus:bg-white text-sm text-gray-900 rounded-full border border-transparent focus:border-gray-200 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all shadow-xs"
          autoFocus
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggested Quick Searches */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-gray-400 mr-1 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-red-600" /> Ideas:
        </span>
        {POPULAR_SEARCHES.map((keyword) => (
          <button
            key={keyword}
            onClick={() => setSearchQuery(keyword)}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
          >
            {keyword}
          </button>
        ))}
      </div>

      {/* Category Pills & Sort Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gray-100">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto text-xs bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              sortBy === 'latest' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              sortBy === 'popular' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Top Liked
          </button>
          <button
            onClick={() => setSortBy('following')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              sortBy === 'following' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Following
          </button>
        </div>

      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing <strong>{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'drawing' : 'drawings'}
          {searchQuery ? ` for "${searchQuery}"` : ''}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
        </span>
        {(searchQuery || selectedCategory !== 'All' || sortBy !== 'latest') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSortBy('latest');
            }}
            className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {filteredPosts.length > 0 ? (
        <MasonryGrid
          posts={filteredPosts}
          currentUser={currentUser}
          likedPostIds={likedPostIds}
          followedUserIds={followedUserIds}
          onLikeToggle={onLikeToggle}
          onFollowToggle={onFollowToggle}
          onCardClick={onCardClick}
        />
      ) : (
        <div className="py-16 text-center space-y-3 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gray-200/80 flex items-center justify-center mx-auto text-gray-600">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            No doodles match your search
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try checking for spelling errors, trying simpler keywords, or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSortBy('latest');
            }}
            className="mt-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            View All Doodles
          </button>
        </div>
      )}

    </div>
  );
};
