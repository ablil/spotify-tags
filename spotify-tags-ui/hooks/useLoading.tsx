import { useCallback, useEffect, useState } from "react";

export enum AppState  {
  idle, loading, done, error
}
export function useApiCall(callback: () => Promise<unknown>) {
  const [error, setError] = useState<Error | undefined>()
  const [state, setState] = useState(AppState.idle)

  const resetState = () => { 
    setError(undefined)
    setState(AppState.idle)
   }
  
  const invoke = useCallback(() => {
    resetState()
    return callback().then(() => {
      setState(AppState.done)
    }).catch((error: Error) => {
      setError(error)
      setState(AppState.error)
    })
  }, [callback])

  return {state, error, invoke}
}