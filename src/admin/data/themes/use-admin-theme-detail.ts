import axios from 'axios';
import {useEffect, useState, useCallback} from 'react';
import {BACKEND_URL} from '../../utils';
import { Theme } from './use-admin-themes';

interface ThemeDetailResponse {
  theme: Theme;
}

export const useAdminThemeDetail = (themeId: string) => {
  // get query to medusa

  const [themeDetailResponse, setThemeDetailResponse] = useState<ThemeDetailResponse | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getData = useCallback(() => {
    setIsLoading(true);
    axios
      .get<ThemeDetailResponse>(`${BACKEND_URL}/admin/theme/${themeId}`)
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
    theme: themeDetailResponse?.theme || null,
    isLoading,
    reload: getData,
  };
};
