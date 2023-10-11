import {useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';

interface PaginationInput {
  limit: number;
  offset: number;
  count: number;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
}

export const usePaginationInfo = ({
  limit,
  offset,
  count,
  setLimit,
  setOffset,
}: PaginationInput) => {
  const [_, setSearchParams] = useSearchParams();

  const pageCount = useMemo(() => {
    // Example count = 21, limit = 5 => PageSize = 21 / 5
    return Math.ceil(count / limit);
  }, [count, limit]);

  const currentPage = useMemo(() => {
    return Math.floor(offset / limit) + 1;
  }, [offset, limit]);

  const hasNext = useMemo(() => {
    return currentPage < pageCount;
  }, [pageCount, currentPage]);

  const hasPrev = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const nextPage = () => {
    // offset: 14, limit: 10, count: 20 => currentPage = 14 // 10
    const currentPage = Math.floor(offset / limit);
    const newPage = currentPage + 1;
    const newOffset = newPage * limit;

    setOffset(newOffset);
    setSearchParams({offset: String(newOffset)});
  };

  const prevPage = () => {
    // offset: 14, limit: 10, count: 20 => currentPage = 14 // 10
    const currentPage = Math.floor(offset / limit);
    const newPage = currentPage - 1;
    const newOffset = newPage * limit;

    setOffset(newOffset);
    setSearchParams({offset: String(newOffset)});
  };
  return {
    pageCount,
    currentPage,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
  };
};
