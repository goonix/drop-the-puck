import { useState } from 'react'
import { getTeamLogoUrl } from '../../utils/teamUtils'

interface Props {
  abbrev: string
  size?: number
  dark?: boolean
  className?: string
}

export default function TeamLogo({ abbrev, size = 32, dark = false, className = '' }: Props) {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <span
        className={`inline-flex items-center justify-center font-bold text-white rounded-full bg-gray-600 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {abbrev.slice(0, 3)}
      </span>
    )
  }

  return (
    <img
      src={getTeamLogoUrl(abbrev, dark)}
      alt={abbrev}
      width={size}
      height={size}
      className={className}
      onError={() => setImgError(true)}
    />
  )
}
