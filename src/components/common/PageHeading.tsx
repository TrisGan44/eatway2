import Button from './Button'

interface PageHeadingProps {
  title: string
  subTitle?: string
  dateLabel?: string
  actionLabel?: string
  onAction?: () => void
}

export default function PageHeading({
  title,
  subTitle,
  dateLabel,
  actionLabel,
  onAction,
}: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div>
        {dateLabel && <p className="eyebrow">{dateLabel}</p>}
        <h1>{title}</h1>
        {subTitle && <p className="muted">{subTitle}</p>}
      </div>
      {actionLabel && (
        <Button onClick={onAction} className="page-heading__action">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
