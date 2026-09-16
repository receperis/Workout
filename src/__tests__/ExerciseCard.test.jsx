// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import ExerciseCard from '../../src/components/ExerciseCard'
import { PYRAMID_REPS } from '../../src/types'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

describe('ExerciseCard', () => {
  it('renders 5 rep rows with correct values', () => {
    render(<ExerciseCard />)

    PYRAMID_REPS.forEach((reps) => {
      const row = screen.getByText(String(reps))
      expect(row).toBeInTheDocument()
    })
  })

  it('renders rows in correct order (15, 13, 11, 9, 7)', () => {
    render(<ExerciseCard />)

    const reps = PYRAMID_REPS.map((reps) => screen.getByText(String(reps)).textContent)
    expect(reps).toEqual(['15', '13', '11', '9', '7'])
  })

  it('each row displays the rep number and "reps" label', () => {
    render(<ExerciseCard />)

    const repsLabels = screen.getAllByText('reps')
    expect(repsLabels).toHaveLength(PYRAMID_REPS.length)
  })

  it('renders weight input per rep row with kg suffix', () => {
    render(<ExerciseCard />)

    PYRAMID_REPS.forEach((reps) => {
      const input = screen.getByRole('spinbutton', { name: reps })
      expect(input).toBeInTheDocument()
    })
  })

  it('each weight input has kg suffix', () => {
    render(<ExerciseCard />)

    const kgLabels = screen.getAllByText('kg')
    expect(kgLabels).toHaveLength(PYRAMID_REPS.length)
  })
})