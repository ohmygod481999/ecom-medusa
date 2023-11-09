import {RouteProps} from '@medusajs/admin';
import {ArrowLeft} from '@medusajs/icons';
import {Button} from '@medusajs/ui';
import {useParams} from 'react-router-dom';
import {Card} from '../../../components/shared/Card';
import {ModalCreateBlog} from '../../../components/blogs/ModalCreateBlog';

const UpdateBlogPage = (props: RouteProps) => {
  const {id} = useParams();

  return (
    <div className="pb-5xlarge">
      <Button
        variant="transparent"
        size="base"
        className="text-grey-50 inter-grey-40 inter-small-semibold px-small py-xsmall mb-xsmall">
        <ArrowLeft /> <span className="ml-1">Back to Blogs</span>
      </Button>
      <div className="gap-x-base grid grid-cols-12">
        <div className="gap-y-xsmall col-span-8 flex flex-col">
          <Card>
            <div className="px-xlarge pt-large pb-xlarge">
              <div className="flex items-center justify-between">
                <h1 className="text-grey-90 inter-xlarge-semibold">Blog</h1>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlogPage;
