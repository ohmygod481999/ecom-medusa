import axios from 'axios';
import { FormImage } from '../../../types/shared';
import {BACKEND_URL} from '../../utils';

export interface FileResponse {
  key: string
  url: string
}

export interface UploadFilesResponse {
  uploads: FileResponse[]
}

export const uploadFiles = async (files: File[]) : Promise<UploadFilesResponse> => {
  if (files.length == 0) {
    throw new Error('files should not be empty');
  }
  const formData = new FormData();
  formData.append('files', files[0]);

  const resp = await axios.post<UploadFilesResponse>(`${BACKEND_URL}/admin/uploads`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
  });

  return resp.data
};

export const nativeFileToFormImage = (file: File): FormImage => {
  return {
    url: URL.createObjectURL(file),
    size: file.size,
    nativeFile: file,
    name: file.name
  }
}
