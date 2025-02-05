import Image from 'next/image'

export const EmptyState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty.png"
        alt="Empty state"
        width={300}
        height={300}
        priority
        className="object-contain"
      />
      <p>No content yet</p>
    </div>
  )
} 