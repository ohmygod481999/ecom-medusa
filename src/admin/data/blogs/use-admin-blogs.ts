import {useAdminProducts} from 'medusa-react';
import axios from 'axios';
import qs from 'qs';
import {useEffect, useState, useCallback} from 'react';
import {BACKEND_URL} from '../../utils';

export interface AdminGetBlogsParams {
  offset?: number;
  limit?: number;
  expand?: string;
  fields?: string;
  order?: string;
}

export enum BlogStatus {
  Draft = 'draft',
  Published = 'published',
}

export interface Blog {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  content: string;
  status: BlogStatus;
  metadata?: any;
  article_category_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface BlogResponse {
  articles: Blog[];
  count: number;
  offset: number;
  limit: number;
}

export const useAdminBlogs = (blogsQueryObject: AdminGetBlogsParams) => {
  // get query to medusa

  const [blogResponse, setBlogResponse] = useState<BlogResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getData = useCallback(() => {
    const query = qs.stringify(blogsQueryObject);
    const query_ = `?${query}`;

    setIsLoading(true);
    axios
      .get<BlogResponse>(`${BACKEND_URL}/admin/article${query_}`)
      .then(resp => {
        setBlogResponse(resp.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [blogsQueryObject]);

  useEffect(() => {
    getData();
  }, [blogsQueryObject]);

  return {
    blogs: blogResponse?.articles || [],
    // TODO
    // limit,
    // offset,
    count: blogResponse?.count || 0,
    isLoading,
    reload: getData
  };
};
