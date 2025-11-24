import type { InputHTMLAttributes } from 'react'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
}

export default function SearchInput({ wrapperClassName = '', ...rest }: SearchInputProps) {
  return (
    <div className={`search-input ${wrapperClassName}`}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 4a7 7 0 0 1 5.64 11.06l3.1 3.1a1 1 0 1 1-1.42 1.42l-3.1-3.1A7 7 0 1 1 11 4zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
          fill="currentColor"
        />
      </svg>
      <input type="search" placeholder="Cari" {...rest} />
    </div>
  )
}
