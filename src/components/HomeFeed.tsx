import React from 'react';
import { Feed, FeedProps } from './Feed';

export interface HomeFeedProps extends FeedProps {
  posts?: any[];
}

export const HomeFeed: React.FC<HomeFeedProps> = (props) => {
  return <Feed {...props} />;
};

export { Feed };

