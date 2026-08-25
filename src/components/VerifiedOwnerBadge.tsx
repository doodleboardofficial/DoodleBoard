import React from 'react';
import { VerifiedBadge, VerifiedBadgeProps } from './VerifiedBadge';

export const VerifiedOwnerBadge: React.FC<VerifiedBadgeProps> = (props) => {
  return <VerifiedBadge {...props} />;
};

export default VerifiedOwnerBadge;
