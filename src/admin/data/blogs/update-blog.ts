import axios from 'axios';
import {BACKEND_URL} from '../../utils';
import {Blog, BlogStatus} from './use-admin-blogs';

export interface UpdateBlogParam {
  title?: string;
  handle?: string;
  status?: BlogStatus;
  category_id?: string;
  content?: string;
  thumbnail?: string;
}

interface UpdateBlogResponse {
  article: Blog;
}

export const updateBlog = async (
  blogId: string,
  blog: UpdateBlogParam,
): Promise<Blog> => {
  const body = {};

  Object.keys(blog).forEach(key => {
    body[key] = blog[key];
  });

  return axios
    .put<UpdateBlogResponse>(`${BACKEND_URL}/admin/article/${blogId}`, body)
    .then(resp => {
      return resp.data.article;
    });
};
