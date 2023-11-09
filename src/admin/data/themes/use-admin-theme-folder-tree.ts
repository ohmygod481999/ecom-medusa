import axios from 'axios';
import {useEffect, useState, useCallback} from 'react';
import {BACKEND_URL} from '../../utils';
import { Theme } from './use-admin-themes';

export interface ThemeFolderTree {
  [key: string]: ThemeFolderTree | string
}

interface ThemeFolderTreeResponse {
  success: boolean
  message: string
  data: ThemeFolderTree
}

export const useAdminFolderTree = (themeId: string) => {
  // get query to medusa

  const [themeDetailResponse, setThemeDetailResponse] = useState<ThemeFolderTreeResponse | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getData = useCallback(() => {
    setIsLoading(true);
    axios
      .get<ThemeFolderTreeResponse>(`${BACKEND_URL}/admin/proxy/themes/${themeId}/files`)
      .then(resp => {
        setThemeDetailResponse(resp.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return {
    files: themeDetailResponse?.data || null,
    isLoading,
    reload: getData,
  };
};
