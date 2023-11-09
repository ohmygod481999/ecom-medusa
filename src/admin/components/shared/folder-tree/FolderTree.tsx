import React, {useState} from 'react';
import {clx} from '@medusajs/ui';
import {ThemeFolderTree} from '../../../data/themes/use-admin-theme-folder-tree';
import {useCodeEdit} from '../../../routes/themes/code-edit/[id]/CodeEditContext';
import { getThemeFileContent } from '../../../data/themes/get-theme-file-content';

interface FolderTreeProps {
  themeFolderTree: ThemeFolderTree;
}

interface FolderTreeItemProps {
  item: ThemeFolderTree | string;
  title: string;
}

const FolderTreeItem = (props: FolderTreeItemProps) => {
  const {addFile, themeId} = useCodeEdit();

  const [isOpen, setIsOpen] = useState(false);
  if (props.item instanceof Object) {
    return (
      <div>
        <h3
          className="cursor-pointer select-none bg-grey-10 rounded-md mb-2 pl-2"
          onClick={() => {
            setIsOpen(!isOpen);
          }}>
          /{props.title}
        </h3>
        <ul
          className={clx('ml-6', {
            hidden: !isOpen,
          })}>
          {Object.keys(props.item).map(key => (
            <li>
              <FolderTreeItem title={key} item={props.item[key]} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // item is string
  const getFileNameFromPath = (fullPath: string) => {
    const splited = fullPath.split('/');
    return splited[splited.length - 1];
  };

  return (
    <div
      className="pl-3 cursor-pointer"
      onClick={async () => {
        // const content = await getThemeFileContent(themeId, props.item as string)
        addFile(props.item as string);
      }}>
      {getFileNameFromPath(props.item)}
    </div>
  );
};

export const FolderTree = (props: FolderTreeProps) => {
  return (
    <div className='max-h-[80vh] overflow-scroll'>
      {props.themeFolderTree && (
        <ul>
          {Object.keys(props.themeFolderTree).map(key => (
            <FolderTreeItem title={key} item={props.themeFolderTree[key]} />
          ))}
        </ul>
      )}
    </div>
  );
};
