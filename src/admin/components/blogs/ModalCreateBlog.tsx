import {
  Button,
  Input,
  FocusModal,
  Heading,
  Label,
  Text,
  Select,
  Toaster,
  useToast,
} from '@medusajs/ui';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';
import {RichEditor, RichEditorRef} from '../shared/RichEditor';
import {useRef, useState, useEffect} from 'react';
import {useAdminBlogCategories} from '../../data/blogs/use-admin-blog-categories';
import {createBlog} from '../../data/blogs/create-blog';
import {ImageForm, ThumbnailFormType} from '../shared/form/ImageForm';
import {nestedForm} from '../../utils/nested-form';
import {nativeFileToFormImage, uploadFiles} from '../../data/files/upload-file';
import {Blog} from '../../data/blogs/use-admin-blogs';
import {OutputData} from '@editorjs/editorjs';
import {updateBlog} from '../../data/blogs/update-blog';
import {AxiosError} from 'axios';
import {urlToFile} from '../../utils/url-to-file';

type CreateBlogInput = {
  title: string;
  handle: string;
  category_id: string;
  thumbnail: ThumbnailFormType;
};

interface ModalCreateBlogProps {
  onCreateSuccess?: () => void;
  blog?: Blog;
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export const ModalCreateBlog = (props: ModalCreateBlogProps) => {
  const {open, setOpen} = props;
  const {toast} = useToast();

  const isUpdate = props.blog ? true : false;

  const form = useForm<CreateBlogInput>();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: {errors},
  } = form;
  const editorRef = useRef<RichEditorRef>();
  const imageFormRef = useRef<any>();

  useEffect(() => {
    if (isUpdate && open) {
      if (props.blog.thumbnail) {
        urlToFile(props.blog.thumbnail, 'test').then(file => {
          if (imageFormRef.current) {
            imageFormRef.current.handleFilesChosen([file])
          }
          // setValue('thumbnail', {
          //   images: [formImage],
          // });
        });
      }
      setValue('title', props.blog.title);
      setValue('handle', props.blog.handle);
      setValue('category_id', props.blog.article_category_id);
      const editorContent = JSON.parse(props.blog.content) as OutputData;

      if (editorRef.current) {
        editorRef.current.setValue(editorContent);
      } else {
        setTimeout(() => {
          editorRef.current.setValue(editorContent);
        }, 100);
        console.log('editorRef not available');
      }
    }
  }, [open]);

  const onSubmit: SubmitHandler<CreateBlogInput> = async data => {
    const {title, handle, category_id, thumbnail} = data;

    let thumbnailUrl = null;

    if (thumbnail?.images && thumbnail.images.length > 0) {
      // upload image
      const uploadImgResp = await uploadFiles(
        thumbnail.images.map(img => img.nativeFile),
      );
      console.log('uploadImgResp', uploadImgResp.uploads);
      if (uploadImgResp.uploads.length > 0) {
        thumbnailUrl = uploadImgResp.uploads[0].url;
      }
    }

    if (editorRef.current) {
      const content = await editorRef.current.getValue();

      const data = {
        title,
        handle,
        article_category_id: category_id,
        content: JSON.stringify(content),
        thumbnail: thumbnailUrl
      };

      try {
        if (isUpdate) {
          const blog = await updateBlog(props.blog.id, data);
        } else {
          const blog = await createBlog(data);
        }
      } catch (err) {
        let msg = '';
        if (err instanceof AxiosError) {
          const errResp = err.response.data;
          msg = errResp.message;
        } else {
          msg = err;
        }
        toast({
          title: 'Error',
          description: msg,
          variant: 'error',
          duration: 5000,
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Successfully created blog.',
        variant: 'success',
        duration: 5000,
      });

      onOpenChange(false);
      if (props.onCreateSuccess) {
        props.onCreateSuccess();
      }
    } else {
      alert('editorRef is not available');
    }
  };

  const {blog_categories} = useAdminBlogCategories({
    offset: 0,
    limit: 100,
  });

  const onOpenChange = isOpen => {
    if (!isOpen) {
      reset();
      setValue('title', '');
      setValue('handle', '');
      setValue('category_id', '');
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Toaster />
      <FocusModal onOpenChange={onOpenChange} open={open} modal>
        <FocusModal.Content className="z-50">
          <FocusModal.Header>
            <Button onClick={handleSubmit(onSubmit)}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16 overflow-auto">
            <div className="flex w-full max-w-lg flex-col gap-y-5">
              <div className="flex flex-col gap-y-1">
                <Heading>Create blog</Heading>
                <Text className="text-ui-fg-subtle">
                  Create and manage API keys. You can create multiple keys to
                  organize your applications.
                </Text>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="key_name" className="text-ui-fg-subtle">
                  Title
                </Label>
                <Input
                  {...register('title', {
                    required: true,
                  })}
                  aria-invalid={errors.title ? true : false}
                  id="title"
                  placeholder="Blog title"
                />
                {errors.title && (
                  <div className="inter-small-regular text-rose-50">
                    This field is required
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="key_name" className="text-ui-fg-subtle">
                  Handle
                </Label>
                <Input
                  {...register('handle')}
                  id="handle"
                  placeholder="Handle, e.g my-blog-post"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="key_name" className="text-ui-fg-subtle">
                  Category
                </Label>
                <Controller
                  control={control}
                  name="category_id"
                  render={({field}) => (
                    <Select
                      value={field.value}
                      onValueChange={val => {
                        field.onChange(val);
                      }}>
                      <Select.Trigger>
                        <Select.Value placeholder="Category" />
                      </Select.Trigger>
                      <Select.Content className="z-50">
                        {blog_categories.map(item => (
                          <Select.Item key={item.id} value={item.id}>
                            {item.title}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="key_name" className="text-ui-fg-subtle">
                  Content
                </Label>
                <RichEditor ref={editorRef} />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="key_name" className="text-ui-fg-subtle">
                  Thumbnail
                </Label>
                <ImageForm form={nestedForm(form, 'thumbnail')} ref={imageFormRef}/>
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};
