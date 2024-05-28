import { useState } from 'react';
import { Pagination } from '@/types.ts';
import { useAsync } from 'react-use';

async function A(B: () => Promise<any>) {
  return await B();
}

export type PaginationEndpoint<T> = (
  from: number,
  perPage: number,
  nonce: number,
  ...args: any[]
) => Promise<Pagination<T>>;

export default function usePagination<T>(
  paginationEndpoint: PaginationEndpoint<T>,
  recordPerPage: number,
  nonce: number,
  ...args: any[]
) {
  const [pageIndex, setPageIndex] = useState(0);
  const [items, setItems] = useState<T[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [total, setTotal] = useState(0);

  useAsync(async () => {
    const response = await A(
      async () => await paginationEndpoint(pageIndex * recordPerPage, recordPerPage, nonce, ...args),
    );

    console.log(response);

    setTotal(total);
    setHasNextPage(hasNextPage);
    setItems(items);
  }, [pageIndex]);

  return {
    items,
    hasNextPage,
    total,
    setPageIndex,
  };
}
