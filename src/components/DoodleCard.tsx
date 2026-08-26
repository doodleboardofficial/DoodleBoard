import React from 'react';
import { Post, User } from '../types';
import { PostCard, PostCardProps } from './PostCard';

export interface DoodleCardProps extends PostCardProps {}

export const DoodleCard: React.FC<DoodleCardProps> = (props) => {
  return <PostCard {...props} />;
};

export { PostCard };

