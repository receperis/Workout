import { useState } from 'react'

function Spinner() {
  const [rotated, setRotated] = useState(false)

  setInterval(() => {
    setRotated((prev) => !prev)
  }, 200)

  return (
    <svg
      data-testid="spinner"
      viewBox="0 0 24 24"
      className="w-6 h-6 text-current"
      style={{ transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.21L7 14.14 2 9.27l6.91-1.02L12 2z"
      />
    </svg>
  )
}

export default Spinner