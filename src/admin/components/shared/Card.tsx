export const Card = ({children}) => {
  return (
    <div className="rounded-rounded bg-grey-0 border-grey-20 flex h-full w-full flex-col overflow-hidden border">
      <div className="relative"></div>
        {children}
    </div>
  )
}
