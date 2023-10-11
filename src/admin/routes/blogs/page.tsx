import {RouteConfig} from '@medusajs/admin';
import {Card} from '../../components/shared/Card';
import {CardHeader} from '../../components/shared/CardHeader';
import {
  Button,
  Input,
  Table,
  FocusModal,
  Heading,
  Label,
  Text,
} from '@medusajs/ui';
import {CardBody} from '../../components/shared/CardBody';
import {useEffect, useMemo, useState} from 'react';
import {useLocation} from 'react-router';
import {useAdminBlogs} from '../../data/blogs/use-admin-blogs';
import {useFilterBlogs} from '../../data/blogs/use-filter-blogs';
import {useBlogTableColumns} from '../../data/blogs/use-blog-table-column';
import {usePagination, useTable} from 'react-table';
import {TablePagination} from '../../components/shared/Pagination';
import {usePaginationInfo} from '../../data/shared/use-pagination';
import {ModalCreateBlog} from '../../components/blogs/ModalCreateBlog';
import './styles.css';

const ListBlogPage = () => {
  // TODO
  const location = useLocation();
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const {queryObject, setLimit, setOffset} = useFilterBlogs(location.search, {
    limit: 10,
    offset: 0,
  });

  const {blogs, isLoading, count, reload} = useAdminBlogs(queryObject); // queryObject will replace {}

  const {
    hasPrev,
    hasNext,
    currentPage,
    pageCount,
    nextPage,
    prevPage,
  } = usePaginationInfo({
    limit: queryObject.limit,
    offset: queryObject.offset,
    count,
    setLimit,
    setOffset,
  });

  // TODO
  const [columns] = useBlogTableColumns({
    reload,
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // canPreviousPage,
    // canNextPage,
    // gotoPage,
    // nextPage,
    // previousPage,
    // Get the state from the instance
    // state: {pageIndex},
  } = useTable(
    {
      columns,
      data: blogs || [],
      manualPagination: true,
      initialState: {
        pageSize: queryObject.limit,
        pageIndex: queryObject.offset / queryObject.limit,
        hiddenColumns: [],
      },
      pageCount,
      autoResetPage: false,
    },
    usePagination,
  );

  const handleNext = () => {
    if (hasNext) {
      nextPage();
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      prevPage();
    }
  };

  return (
    <div>
      <Card>
        <div className="flex grow flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div>
                  <div className="inter-large-semibold gap-x-base text-grey-40 flex">
                    <div className="cursor-pointer text-grey-90">Blogs</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div>
                  <div>
                    <div className="flex space-x-2">
                      <ModalCreateBlog
                        open={openModalCreate}
                        setOpen={setOpenModalCreate}
                        onCreateSuccess={() => {
                          reload();
                        }}
                      />
                      <Button onClick={() => setOpenModalCreate(true)}>Create blog</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col grow">
              <div>
                <div
                  className="relative"
                  style={{
                    minHeight: '640px',
                  }}>
                  <div className="flex flex-col undefined">
                    {/* Actions */}
                    <div className="mb-2 flex w-full justify-between">
                      <div className="mb-2 flex self-end">
                        {/* Filter or something go here */}
                      </div>
                      <div className="flex space-x-1">
                        <Input
                          placeholder="Search"
                          id="search-input"
                          type="search"
                          size="small"
                        />
                      </div>
                    </div>
                    {/* End actions */}
                    {/* Start table */}
                    <div className="relative">
                      {/* React table will go here */}
                      <Table {...getTableProps()}>
                        <Table.Header>
                          {headerGroups?.map(headerGroup => (
                            <Table.Row {...headerGroup.getHeaderGroupProps()}>
                              {headerGroup.headers.map(col => (
                                <Table.HeaderCell {...col.getHeaderProps()}>
                                  {col.render('Header')}
                                </Table.HeaderCell>
                              ))}
                            </Table.Row>
                          ))}
                        </Table.Header>
                        <Table.Body {...getTableBodyProps()}>
                          {rows.map(row => {
                            prepareRow(row);
                            return (
                              <Table.Row
                                color={'inherit'}
                                linkTo={row.original.id}
                                {...row.getRowProps()}
                                className="group">
                                {row.cells.map(cell => {
                                  return (
                                    <Table.Cell {...cell.getCellProps()}>
                                      {cell.render('Cell')}
                                    </Table.Cell>
                                  );
                                })}
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table>
                    </div>
                    {/* end table */}
                  </div>
                </div>
                <div className="mt-14">
                  <TablePagination
                    pagingState={{
                      title: 'Blogs',
                      count,
                      offset: queryObject.offset,
                      hasNext,
                      hasPrev,
                      currentPage,
                      pageSize: queryObject.limit,
                      pageCount,
                      nextPage: handleNext,
                      prevPage: handlePrev,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </div>
      </Card>
    </div>
  );
};

export const config: RouteConfig = {
  link: {
    label: 'Blogs',
  },
};

export default ListBlogPage;
