import {useMemo, useState} from 'react';
import {
  EllipsisHorizontal,
  PencilSquare,
  Plus,
  Trash,
  PhotoSolid,
} from '@medusajs/icons';
import {
  Badge,
  Button,
  DropdownMenu,
  Prompt,
  Toaster,
  useToast,
} from '@medusajs/ui';
import {Blog, BlogStatus} from './use-admin-blogs';
import {deleteBlog} from './delete-blog';
import {updateBlog} from './update-blog';
import {ModalCreateBlog} from '../../components/blogs/ModalCreateBlog';

export const useBlogTableColumns = (props: {reload: () => void}) => {
  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">Title</div>,
        id: 'title',
        accessor: x => x,
        Cell: ({cell: {value}}) => (
          <>
            <div className="flex items-center">
              <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                {value.thumbnail ? (
                  <img
                    className="rounded-soft h-full object-cover"
                    src={value.thumbnail}
                  />
                ) : (
                  <div className="rounded-soft bg-grey-5 flex h-full w-full items-center justify-center">
                    <PhotoSolid />
                  </div>
                )}
              </div>
              {value.title}
            </div>
          </>
        ),
      },
      {
        Header: <div className="pl-2">Handle</div>,
        accessor: 'handle',
        Cell: ({cell: {value}}) => (
          <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2">{`${value}`}</p>
        ),
      },
      {
        Header: <div className="pl-2">Status</div>,
        accessor: 'status',
        Cell: ({cell: {value}}: {cell: {value: BlogStatus}}) => {
          const colorMapper = {
            [BlogStatus.Draft]: 'grey',
            [BlogStatus.Published]: 'green',
          };
          return <Badge color={colorMapper[value] as any}>{value}</Badge>;
        },
      },
      {
        id: 'actions',
        Header: <div className="pl-2"></div>,
        accessor: x => x,
        Cell: ({cell: {value}}: {cell: {value: Blog}}) => {
          const [open, _setOpen] = useState<boolean>(false);
          const {toast} = useToast();

          const [openDropDownMenu, setOpenDropDownMenu] = useState<boolean>(
            false,
          );
          const [openModalUpdate, _setOpenModalUpdate] = useState<boolean>(
            false,
          );

          const setOpen = isOpen => {
            setTimeout(() => {
              _setOpen(isOpen);
            }, 10);
          };

          const setOpenModalUpdate = isOpen => {
            setTimeout(() => {
              _setOpenModalUpdate(isOpen);
            }, 10);
          };

          const handleDelete = async () => {
            try {
              await deleteBlog(value.id);
              toast({
                title: 'Success',
                description: 'Successfully delete blog.',
                variant: 'success',
                duration: 5000,
              });
              props.reload();
            } catch (e) {
              toast({
                title: 'Something wrong happen',
                description: e,
                variant: 'error',
                duration: 5000,
              });
            }
          };

          const handleChangePublish = async () => {
            try {
              await updateBlog(value.id, {
                status:
                  value.status === BlogStatus.Published
                    ? BlogStatus.Draft
                    : BlogStatus.Published,
              });
              toast({
                title: 'Success',
                description: 'Successfully delete blog.',
                variant: 'success',
                duration: 5000,
              });
              props.reload();
            } catch (e) {
              toast({
                title: 'Something wrong happen',
                description: e,
                variant: 'error',
                duration: 5000,
              });
            }
          };

          return (
            <>
              <Toaster />
              <ModalCreateBlog
                blog={value}
                open={openModalUpdate}
                setOpen={setOpenModalUpdate}
                onCreateSuccess={() => props.reload()}
              />

              <Prompt open={open} onOpenChange={setOpen}>
                <Prompt.Content>
                  <Prompt.Header>
                    <Prompt.Title>
                      Delete blog <span className="italic">{value.title}</span>
                    </Prompt.Title>
                    <Prompt.Description>
                      Are you sure? This cannot be undone.
                    </Prompt.Description>
                  </Prompt.Header>
                  <Prompt.Footer>
                    <Prompt.Cancel>Cancel</Prompt.Cancel>
                    <Prompt.Action onClick={handleDelete}>Delete</Prompt.Action>
                  </Prompt.Footer>
                </Prompt.Content>
              </Prompt>

              <DropdownMenu
                open={openDropDownMenu}
                onOpenChange={setOpenDropDownMenu}>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="transparent"
                    onClick={() => setOpenDropDownMenu(true)}>
                    <EllipsisHorizontal />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    className="gap-x-2"
                    onClick={() => setOpenModalUpdate(true)}>
                    <PencilSquare className="text-ui-fg-subtle" />
                    Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="gap-x-2"
                    onClick={handleChangePublish}>
                    <Plus className="text-ui-fg-subtle" />
                    {value.status === BlogStatus.Published && 'Unpublish'}
                    {value.status === BlogStatus.Draft && 'Publish'}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="gap-x-2"
                    onClick={() => setOpen(true)}>
                    <Trash className="text-ui-fg-subtle" />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </>
          );
        },
      },
    ],
    [],
  );

  return [columns];
};
