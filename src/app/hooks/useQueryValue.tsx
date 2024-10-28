'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const isString = (value: any): value is string => typeof value === 'string'

export const useQueryValue = (
  key: string,
  defaultValue = '',
  hiddenValue: any = undefined
) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { push } = useRouter()
  const [value, setValue] = useState<any>(
    isString(searchParams.get(key)) ? searchParams.get(key) : defaultValue
  )

  const handleValueChange = (newValue: any): void => {
    setValue(newValue)
    const newSearchParams = new URLSearchParams(searchParams.toString())

    if (newValue !== hiddenValue) {
      newSearchParams.set(key, newValue)
    }

    newValue === hiddenValue && newSearchParams.delete(key)
    newSearchParams.delete('page')

    push(`${pathname}?${newSearchParams.toString()}`)
  }

  return [value, handleValueChange]
}
