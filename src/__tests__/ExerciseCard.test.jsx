// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import ExerciseCard from '../components/ExerciseCard'
import { PYRAMID_REPS } from '../types'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

describe('ExerciseCard', () => {
  it('renders exercise name as heading', () => {
    render(<ExerciseCard exerciseName="Bench Press" onChange={() => {}} />)
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
  })

  it('renders 5 rep rows with correct values', () => {
    render(<ExerciseCard exerciseName="Bench Press" onChange={() => {}} />)
    PYRAMID_REPS.forEach((reps) => {
      expect(screen.getByText(String(reps))).toBeInTheDocument()
    })
  })

  it('renders rows in correct order (15, 13, 11, 9, 7)', () => {
    render(<ExerciseCard exerciseName="Bench Press" onChange={() => {}} />)
    const reps = PYRAMID_REPS.map((reps) => screen.getByText(String(reps)).textContent)
    expect(reps).toEqual(['15', '13', '11', '9', '7'])
  })

  it('each row displays the rep number and "reps" label', () => {
    render(<ExerciseCard exerciseName="Bench Press" onChange={() => {}} />)
    const repsLabels = screen.getAllByText('reps')
    expect(repsLabels).toHaveLength(PYRAMID_REPS.length)
  })

  it('renders weight input per rep row with kg suffix', () => {
    render(<ExerciseCard exerciseName="Bench Press" onChange={() => {}} />)
    PYRAMID_REPS.forEach((reps) => {
      const input = screen.getByRole('spinbutton', { name: `Bench Press ${reps} reps weight` })
      expect(input).toBeInTheDocument()
    })
  })

  it('each weight input has kg suffix', () => {
    render(<ExerciseCard exerciseName="Bench Press" onChange={() => {}} />)
    const kgLabels = screen.getAllByText('kg')
    expect(kgLabels).toHaveLength(PYRAMID_REPS.length)
  })

  it('displays total as 0 when no weights entered', () => {
    render(<ExerciseCard exerciseName="Bench Press" onChange={() => {}} />)
    expect(screen.getByText('Total: 0 kg')).toBeInTheDocument()
  })

  it('calculates total correctly when weights are entered', () => {
    const onChange = () => {}
    render(<ExerciseCard exerciseName="Bench Press" onChange={onChange} />)
    const inputs = PYRAMID_REPS.map((reps) =>
      screen.getByRole('spinbutton', { name: `Bench Press ${reps} reps weight` })
    )
    fireEvent.change(inputs[0], { target: { value: '20' } })
    fireEvent.change(inputs[1], { target: { value: '25' } })
    fireEvent.change(inputs[2], { target: { value: '30' } })
    fireEvent.change(inputs[3], { target: { value: '35' } })
    fireEvent.change(inputs[4], { target: { value: '40' } })
    // 15*20 + 13*25 + 11*30 + 9*35 + 7*40 = 300+325+330+315+280 = 1550
    expect(screen.getByText('Total: 1550 kg')).toBeInTheDocument()
  })

  it('calls onChange with sets array when weights change', () => {
    let receivedSets = []
    const onChange = (sets) => { receivedSets = sets }
    render(<ExerciseCard exerciseName="Bench Press" onChange={onChange} />)
    const input = screen.getByRole('spinbutton', { name: 'Bench Press 15 reps weight' })
    fireEvent.change(input, { target: { value: '50' } })
    expect(receivedSets).toHaveLength(5)
    expect(receivedSets[0]).toEqual({ exercise: 'Bench Press', reps: 15, weight: 50 })
  })
})
