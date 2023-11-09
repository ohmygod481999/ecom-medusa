import {useAdminProducts} from 'medusa-react';
import axios from 'axios';
import qs from 'qs';
import {useEffect, useState, useCallback} from 'react';
import {BACKEND_URL} from '../../utils';

export interface Theme {
  id: string;
  title: string;
  url: string;
  description: string;
  thumnail: string;
  metadata?: any;

  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ThemeList {
  themes: Theme[];
  current_theme: string;
}

interface ThemeListResponse {
  theme_list: ThemeList;
}

export const useAdminThemeList = () => {
  // get query to medusa

  const [themeListResponse, setThemeListResponse] = useState<ThemeListResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getData = useCallback(() => {
    setIsLoading(true);
    axios
      .get<ThemeListResponse>(`${BACKEND_URL}/admin/theme`)
      .then(resp => {
        setThemeListResponse(resp.data);
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
    theme_list: themeListResponse?.theme_list || null,
    isLoading,
    reload: getData,
  };
};
