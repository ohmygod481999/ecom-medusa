import axios from 'axios';
import { BACKEND_URL } from '../../utils';
import { Blog } from './use-admin-blogs';

export interface CreateBlogParam {
  title: string
  handle?: string
  category_id?: string
  content: string
  thumbnail?: string
}

interface CreateBlogResponse {
  article: Blog
}

export const createBlog = async (blog: CreateBlogParam) : Promise<Blog> => {
  const { title, handle, category_id, content, thumbnail } = blog

  const body = {
    title,
    content,
  }

  if (handle) {
    body["handle"] = handle
  }
  if (category_id) {
    body["article_category_id"] = category_id
  }
  if (thumbnail) {
    body["thumbnail"] = thumbnail
  }

  return axios.post<CreateBlogResponse>(`${BACKEND_URL}/admin/article`, body).then(resp => {
    return resp.data.article
  })
}
