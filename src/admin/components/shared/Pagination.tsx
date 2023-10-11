import { Avatar } from "@medusajs/ui"
import ArrowLeftIcon from "../icons/ArrowLeftIcon"
import ArrowRightIcon from "../icons/ArrowRightIcon"

export type PagingProps = {
  title: string
  currentPage: number
  pageSize: number
  pageCount: number
  count: number
  offset: number
  hasNext: boolean
  hasPrev: boolean
  nextPage: () => void
  prevPage: () => void
}

type Props = {
  isLoading?: boolean
  pagingState: PagingProps
}

export const TablePagination = ({
  isLoading = false,
  pagingState: {
    title,
    currentPage,
    pageCount,
    pageSize,
    count,
    offset,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  },
}: Props) => {
  const soothedOffset = count > 0 ? offset + 1 : 0
  const soothedPageCount = Math.max(1, pageCount)

  return (
    <>
      <div
        className={
          "inter-small-regular text-grey-50 flex w-full justify-between"
        }
      >
          <div>
            {`${soothedOffset} - ${soothedOffset + pageSize - 1} of ${count} ${title}`}
          </div>
        <div className="flex space-x-4">
            <div>
              {`${currentPage} of ${soothedPageCount}`}
            </div>
          <div className="flex items-center space-x-4">
            <button
              className="disabled:text-grey-30 cursor-pointer disabled:cursor-default"
              disabled={!hasPrev || isLoading}
              onClick={() => prevPage()}
            >
              <ArrowLeftIcon />
            </button>
            <button
              className="disabled:text-grey-30 cursor-pointer disabled:cursor-default"
              disabled={!hasNext || isLoading}
              onClick={() => nextPage()}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
