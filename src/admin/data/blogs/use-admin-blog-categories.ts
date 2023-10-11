import axios from 'axios';
import qs from 'qs';
import {useEffect, useState} from 'react';
import { useDeepCompareEffect } from '../../hooks/use-deep-compare-effect';
import { BACKEND_URL } from '../../utils';

export interface AdminGetBlogCategoriesParams {
  offset?: number;
  limit?: number;
  expand?: string;
  fields?: string;
  order?: string;
}

export interface BlogCategory {
  id: string;
  title: string;
  handle: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface BlogCategoriesResponse {
  article_categories: BlogCategory[];
  count: number;
  offset: number;
  limit: number;
}

export const useAdminBlogCategories = (blogCategoriesQueryObject: AdminGetBlogCategoriesParams) => {
  // get query to medusa

  const [blogResponse, setBlogResponse] = useState<BlogCategoriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useDeepCompareEffect(() => {
    const query = qs.stringify(blogCategoriesQueryObject);
    const query_ = `?${query}`;

    setIsLoading(true);
    axios
      .get<BlogCategoriesResponse>(`${BACKEND_URL}/admin/article-category${query_}`)
      .then(resp => {
        setBlogResponse(resp.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [blogCategoriesQueryObject]);

  return {
    blog_categories: blogResponse?.article_categories || [],
    // TODO
    // limit,
    // offset,
    count: blogResponse?.count || 0,
    isLoading,
  };
};
