import React from 'react';
import { Post, User } from '../types';
import { DoodleCard } from './DoodleCard';

interface MasonryGridProps {
  posts: Post[];
  currentUser: User | null;
  likedPostIds: string[];
  followedUserIds: string[];
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onCardClick: (post: Post) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  posts,
  currentUser,
  likedPostIds,
  followedUserIds,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
}) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div
      id="masonry-doodle-grid"
      className="w-full columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]"
    >
      {posts.map((post) => {
        const isLiked = likedPostIds.includes(post.id);
        const isFollowing = followedUserIds.includes(post.userId);

        return (
          <DoodleCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            isLiked={isLiked}
            isFollowing={isFollowing}
            onLikeToggle={onLikeToggle}
            onFollowToggle={onFollowToggle}
            onCardClick={onCardClick}
          />
        );
      })}
    </div>
  );
};
