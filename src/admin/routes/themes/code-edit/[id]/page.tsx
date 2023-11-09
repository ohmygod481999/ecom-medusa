import {RouteProps} from '@medusajs/admin';
import {useParams} from 'react-router-dom';
import { CodeEditor } from '../../../../components/shared/code-editor/CodeEditor';
import { FolderTree } from '../../../../components/shared/folder-tree/FolderTree';
import {useAdminThemeDetail} from '../../../../data/themes/use-admin-theme-detail';
import { useAdminFolderTree } from '../../../../data/themes/use-admin-theme-folder-tree';
import { CodeEditContext, useCodeEditContext } from './CodeEditContext';

const EditCodeThemePage = (props: RouteProps) => {
  const {id} = useParams();
  const {theme} = useAdminThemeDetail(id);
  const {files} = useAdminFolderTree(id)

  const codeEditCtx = useCodeEditContext(id)

  return (
    <CodeEditContext.Provider value={codeEditCtx}>
      <div className="pb-5xlarge">
        <div className='flex'>
          <div className='overflow-clip basis-1/4 break-words max-w-sm'>
            <FolderTree themeFolderTree={files}/>
          </div>
          <div className='basis-3/4'>
            <CodeEditor></CodeEditor>
          </div>
        </div>
      </div>
    </CodeEditContext.Provider>
  );
};

export default EditCodeThemePage;
