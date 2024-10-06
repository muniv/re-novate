import { useEffect, useState } from 'react'

interface debounceProps<T> {
    value: T
    delay?: number
}

/***
 const debouncedState = useDebounce({ value: state, delay: 300 })
 ***/
function useDebounce<T>({ value, delay = 500 }: debounceProps<T>): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
}

export default useDebounce
