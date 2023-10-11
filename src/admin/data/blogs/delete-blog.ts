import axios from 'axios';
import {BACKEND_URL} from '../../utils';

export const deleteBlog = async (blogId: string) => {
  await axios.delete(`${BACKEND_URL}/admin/article/${blogId}`);
};
