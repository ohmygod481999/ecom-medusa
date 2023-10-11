import _ from "lodash"
import { useRef, useEffect } from "react"

function deepCompareEquals(a, b){
  return _.isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  const ref = useRef() 
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export function useDeepCompareEffect(callback: () => void, dependencies: any[]) {
  useEffect(
    callback,
    dependencies.map(useDeepCompareMemoize)
  )
}
