import { useRef } from 'react'

interface UploadCardProps {
  title?: string
  highlightLabel?: string
  description?: string
  onFileSelect?: (file: File) => void
}

export default function UploadCard({
  title = 'Profil User',
  highlightLabel = 'Click here',
  description = 'to upload or drop files here',
  onFileSelect,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (files && files[0] && onFileSelect) {
      onFileSelect(files[0])
    }
  }

  return (
    <div
      className="upload-card"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="upload-card__body">
        <div className="upload-card__dropzone">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3l3.5 3.5-1.4 1.4-1.1-1.1V14h-2V6.8L9.9 7.9 8.5 6.5 12 3zm-7 9h2v7h10v-7h2v9H5v-9z"
              fill="#721E1E"
            />
          </svg>
        </div>
        <p className="upload-card__title">{title}</p>
        <p className="upload-card__description">
          <span className="upload-card__highlight">{highlightLabel}</span> {description}
        </p>
      </div>
    </div>
  )
}
