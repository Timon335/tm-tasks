import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

function formatDate(value) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(`${value}T00:00:00+07:00`))
}

function toDateInputValue(value) {
  const date = new Date(value)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]))
  return `${values.year}-${values.month}-${values.day}`
}

function addDays(value, days) {
  const date = new Date(`${value}T00:00:00`)
  date.setDate(date.getDate() + days)
  return toDateInputValue(date)
}

function groupSlotsByDate(payload) {
  const slots = Array.isArray(payload) ? payload : payload?.slots ?? []
  return slots.reduce((groups, slot) => {
    const date = slot.slot_date
    if (!groups.has(date)) groups.set(date, [])
    groups.get(date).push(slot)
    return groups
  }, new Map())
}

// แสดงช่วงเวลาพร้อมที่นั่งคงเหลือภายใน 30 วันตาม FR-BKG-01 และ FR-BKG-06.
export default function SlotPicker({ apiClient = api, today = new Date() }) {
  const firstDate = toDateInputValue(today)
  const [dateFrom, setDateFrom] = useState(firstDate)
  const [packageCode, setPackageCode] = useState('')
  const [groups, setGroups] = useState(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!packageCode.trim()) {
      setGroups(new Map())
      setError('')
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')
    apiClient
      .getSlots({ dateFrom, packageCode: packageCode.trim() })
      .then((payload) => {
        if (!cancelled) setGroups(groupSlotsByDate(payload))
      })
      .catch(() => {
        if (!cancelled) setError('ไม่สามารถโหลดช่วงเวลาว่างได้')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [apiClient, dateFrom, packageCode])

  const maxDate = addDays(firstDate, 30)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <section className="mx-auto max-w-4xl">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Booking</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">ระบบจองคิวตรวจสุขภาพ</h1>
          <p className="mt-2 text-slate-600">เลือกแพ็กเกจและช่วงเวลาที่สะดวก</p>
        </header>

        <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            รหัสแพ็กเกจ
            <input
              aria-label="รหัสแพ็กเกจ"
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              value={packageCode}
              onChange={(event) => setPackageCode(event.target.value)}
              placeholder="กรอกรหัสแพ็กเกจ"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            เริ่มค้นหาตั้งแต่วันที่
            <input
              aria-label="วันที่เริ่มต้น"
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              type="date"
              min={firstDate}
              max={maxDate}
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>
        </div>

        <section className="mt-8" aria-live="polite">
          {loading && <p className="text-slate-600">กำลังโหลดช่วงเวลาว่าง...</p>}
          {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
          {!loading && !error && !packageCode.trim() && (
            <p className="rounded-lg border border-dashed border-slate-300 p-6 text-slate-600">
              กรอกรหัสแพ็กเกจเพื่อดูช่วงเวลาที่ว่าง
            </p>
          )}
          {!loading && !error && packageCode.trim() && groups.size === 0 && (
            <p className="rounded-lg border border-dashed border-slate-300 p-6 text-slate-600">
              ไม่พบช่วงเวลาที่ว่างในช่วง 30 วัน
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {[...groups].map(([date, slots]) => (
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={date}>
                <h2 className="font-semibold text-slate-950">{formatDate(date)}</h2>
                <ul className="mt-4 grid gap-3">
                  {slots.map((slot) => (
                    <li className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3" key={slot.id}>
                      <span className="font-medium">{slot.start_time}</span>
                      <span className="text-sm text-slate-600">เหลือ {slot.remaining} ที่นั่ง</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
