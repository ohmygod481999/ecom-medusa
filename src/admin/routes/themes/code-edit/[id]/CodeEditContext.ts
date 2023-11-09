import {createContext, useState, useContext, useMemo} from 'react';
import { getThemeFileContent } from '../../../../data/themes/get-theme-file-content';

export interface FileContent {
  name: string;
  value: string;
  newValue: string;
}

export interface CodeEditContext {
  themeId: string
  files: FileContent[];
  currentFileContent: string;
  currentFileExtension: string
  activeFileIndex?: number;
  addFile: (filePath: string) => void;
  setActiveFileIndex: (idx: number) => void;
}

export const CodeEditContext = createContext<CodeEditContext | null>(null);

export const useCodeEditContext = (themeId: string): CodeEditContext => {
  const [files, setFiles] = useState<FileContent[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number | undefined>();

  const addFile = async (fileName: string) => {
    const fileExistIdx = files.findIndex(file => {
      return file.name === fileName;
    });

    if (fileExistIdx != -1) {
      setActiveFileIndex(fileExistIdx);
      return;
    }

    const content = await getThemeFileContent(themeId, fileName)

    const newFiles = [
      ...files,
      {
        name: fileName,
        value: content.content,
        newValue: content.content,
      },
    ];
    setFiles(newFiles);
    setActiveFileIndex(newFiles.length - 1);
  };

  const currentFileContent = useMemo(() => {
    if (activeFileIndex !== undefined && files.length > activeFileIndex) {
      return files[activeFileIndex].newValue;
    }

    return '';
  }, [files, activeFileIndex]);

  const currentFileExtension = useMemo(() => {
    if (activeFileIndex !== undefined && files.length > activeFileIndex) {
      const splited = files[activeFileIndex].name.split(".")
      const extenstion = splited[splited.length - 1];

      const m = {
        "js": "javascript",
        "liquid": "html"
      }

      return extenstion in m ? m[extenstion] : extenstion
    }

    return "javascript";
  }, [files, activeFileIndex]);

  return {
    themeId,
    files,
    currentFileContent,
    currentFileExtension,
    activeFileIndex,
    addFile,
    setActiveFileIndex,
  };
};

export const useCodeEdit = () => {
  return useContext(CodeEditContext);
};
