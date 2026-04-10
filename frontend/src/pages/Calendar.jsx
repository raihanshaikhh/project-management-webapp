import { useState } from 'react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENTS = [
  { id: 1, title: 'Fix login bug',   date: '2026-04-06', color: 'blue'   },
  { id: 2, title: 'Review PR #42',   date: '2026-04-07', color: 'yellow' },
  { id: 3, title: 'Team standup',    date: '2026-04-10', color: 'green'  },
  { id: 4, title: 'Design review',   date: '2026-04-15', color: 'pink'   },
  { id: 5, title: 'Sprint planning', date: '2026-04-20', color: 'purple' },
];

const EVENT_COLORS = {
  blue:   'bg-blue-600/20 text-blue-400',
  yellow: 'bg-yellow-600/20 text-yellow-400',
  green:  'bg-emerald-600/20 text-emerald-400',
  pink:   'bg-pink-600/20 text-pink-400',
  purple: 'bg-purple-600/20 text-purple-400',
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // build days array
  const startDay        = new Date(year, month, 1).getDay();
  const daysInMonth     = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today           = new Date();

  const days = [];

  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ date: daysInPrevMonth - i, currentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, currentMonth: true });
  }
  while (days.length < 42) {
    days.push({ date: days.length - daysInMonth - startDay + 1, currentMonth: false });
  }

  const monthLabel = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{monthLabel}</h1>
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="px-3 py-1.5 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
            Today
          </button>
          <button onClick={prevMonth} className="p-1.5 text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button onClick={nextMonth} className="p-1.5 text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">

        {/* Day labels */}
        <div className="grid grid-cols-7 border-b border-zinc-800">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="py-2 text-center text-xs font-medium text-zinc-500">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const isToday =
              day.currentMonth &&
              day.date === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
            const dayEvents = day.currentMonth ? EVENTS.filter(e => e.date === dateStr) : [];

            return (
              <div
                key={i}
                className={`min-h-24 p-2 border-r border-b border-zinc-800 last:border-r-0 flex flex-col gap-1
                  ${!day.currentMonth ? 'bg-zinc-900/40' : ''}`}
              >
                {/* Day number */}
                <div className="flex justify-end">
                  <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-blue-600 text-white font-semibold' : day.currentMonth ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {day.date}
                  </span>
                </div>

                {/* Events */}
                {dayEvents.map(event => (
                  <div key={event.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${EVENT_COLORS[event.color]}`}>
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}