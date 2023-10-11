import qs from 'qs';
import {useState, useEffect, useMemo} from 'react';
import {AdminGetBlogsParams} from './use-admin-blogs';

const initQueryObject = (
  queryString: string,
  defaultQueryObject: AdminGetBlogsParams,
): AdminGetBlogsParams => {
  // remove first question mark `?` if exist
  let _queryString = queryString;
  if (queryString && queryString[0] == '?') {
    _queryString = queryString.substring(1, queryString.length);
  }

  const queryObject: AdminGetBlogsParams = qs.parse(_queryString);

  Object.keys(queryObject).forEach(key => {
    console.log('test ', Number(queryObject[key]));
    if (queryObject[key] && !isNaN(Number(queryObject[key]))) {
      queryObject[key] = Number(queryObject[key]);
    }
  });

  return {
    ...defaultQueryObject,
    ...queryObject,
  };
};

export const useFilterBlogs = (
  queryString: string,
  defaultQueryObject: AdminGetBlogsParams,
) => {

  const [queryObject, setQueryObject] = useState<AdminGetBlogsParams>(
    initQueryObject(queryString, defaultQueryObject),
  );


  const setLimit = (limit: number) => {
    setQueryObject({
      ...queryObject,
      limit,
    });
  };

  const setOffset = (offset: number) => {
    setQueryObject({
      ...queryObject,
      offset,
    });
  };

  return {
    queryObject,
    setQueryObject,
    setLimit,
    setOffset,
  };
};
