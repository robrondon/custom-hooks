import { useEffect, useState } from "react"

const localCache = {}

export const useFetch = (url) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    hasError: false,
    error: null
  });
  useEffect(() => {

    const getFetch = async () => {
      setLoadingState()

      if (localCache[url]) {
        console.log('usando caché')
        setState({
          data: localCache[url],
          isLoading: false,
          hasError: false,
          error: null,
        })
        return
      }

      const resp = await fetch(url)

      // sleep
      await new Promise(resolve => setTimeout(resolve, 500))

      if (!resp.ok) {
        setState({
          data: null,
          isLoading: false,
          hasError: true,
          error: {
            code: resp.status,
            message: resp.statusText
          }
        })

        return
      }

      const data = await resp.json()
      setState({
        data,
        isLoading: false,
        hasError: false,
        error: null,
      })

      // Manejo del caché
      localCache[url] = data

      console.log({ data })
    }

    getFetch()
  }, [url]);

  const setLoadingState = () => {
    setState({
      data: null,
      isLoading: true,
      hasError: false,
      error: null,
    })
  }

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError
  }
}


// TanStackQuery hace todo esto con esteroides.. Fernando tiene curso gratuito