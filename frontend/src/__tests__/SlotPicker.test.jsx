import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SlotPicker from '../pages/SlotPicker.jsx'

const firstSlots = [
  { id: 1, slot_date: '2026-09-24', start_time: '09:00', remaining: 2 },
]

const secondSlots = [
  { id: 2, slot_date: '2026-09-25', start_time: '10:00', remaining: 1 },
]

test('SlotPicker แสดงช่วงเวลาว่างและโหลดใหม่เมื่อเปลี่ยนแพ็กเกจ', async () => {
  const getSlots = vi.fn(({ packageCode }) =>
    Promise.resolve({ slots: packageCode === 'basic' ? firstSlots : secondSlots }),
  )
  const apiClient = { getSlots }

  render(<SlotPicker apiClient={apiClient} today={new Date('2026-09-23T00:00:00+07:00')} />)

  fireEvent.change(screen.getByLabelText('รหัสแพ็กเกจ'), { target: { value: 'basic' } })
  expect(await screen.findByText('09:00')).toBeTruthy()
  expect(screen.getByText('เหลือ 2 ที่นั่ง')).toBeTruthy()

  fireEvent.change(screen.getByLabelText('รหัสแพ็กเกจ'), { target: { value: 'premium' } })
  await waitFor(() => expect(screen.getByText('10:00')).toBeTruthy())
  expect(screen.getByText('เหลือ 1 ที่นั่ง')).toBeTruthy()
  expect(getSlots).toHaveBeenLastCalledWith({ dateFrom: '2026-09-23', packageCode: 'premium' })
})
