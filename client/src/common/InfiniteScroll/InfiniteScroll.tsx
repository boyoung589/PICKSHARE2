import React from 'react';
import { IOptions } from '../../types/feedType';

const InfiniteScroll = (
  dataFetchFunction: (
    io: IntersectionObserver
  ) => boolean | void | (() => void),
  target: React.RefObject<HTMLDivElement>,
  setTargetLoading: (par: boolean) => void
) => {
  if (target) {
    const options: IOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTargetLoading(entry.isIntersecting);
          setTimeout(() => {
            dataFetchFunction(io);
            setTargetLoading(false);
          }, 100);
        }
      });
    }, options);

    if (target.current) {
      io.observe(target.current);
    }
  }
};

export default InfiniteScroll;
