// Create a new file: components/MemoizedHyperspeed.tsx
"use client";
import { useMemo } from 'react';
import Hyperspeed from './Hyperspeed';
import type { HyperspeedProps } from './Hyperspeed'; // Adjust import as needed

const MemoizedHyperspeed = ({ effectOptions }: HyperspeedProps) => {
  const stableOptions = useMemo(() => effectOptions, [JSON.stringify(effectOptions)]);

  return <Hyperspeed effectOptions={stableOptions} />;
};

export default MemoizedHyperspeed;
