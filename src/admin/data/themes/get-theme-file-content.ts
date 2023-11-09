import axios from 'axios';
import {BACKEND_URL} from '../../utils';

export interface ThemeFileContent {
  content: string;
  content_type: string;
}

interface ThemeFileContentResponse {
  success: boolean;
  data: ThemeFileContent;
  message: string;
}

export const getThemeFileContent = async (
  themeId: string,
  path: string,
): Promise<ThemeFileContent> => {
  let encodedPath = encodeURIComponent(path);
  encodedPath = encodedPath.replace('.', '%2E');

  const resp = await axios.get<ThemeFileContentResponse>(
    `${BACKEND_URL}/admin/proxy/themes/${themeId}/files/content?path=${path}`,
  );

  return resp.data.data;
};
