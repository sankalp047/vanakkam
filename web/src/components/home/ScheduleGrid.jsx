import { useState } from 'react';
import { useRoster } from '../../hooks/useRoster';
import { buildWeeklySchedule, WEEKDAY_LABELS } from '../../lib/schedule';
import { RJBioModal } from '../shared/RJBioModal';
import './ScheduleGrid.css';

const TODAY_INDEX = new Date().getDay();

export function ScheduleGrid() {
  const { roster } = useRoster();
  const { byDay, unscheduled } = buildWeeklySchedule(roster);
  const [selectedRj, setSelectedRj] = useState(null);

  return (
    <section className="schedule-section" id="schedule">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Weekly Lineup</span>
          <h2>
            What's <span className="highlight">On</span>
          </h2>
          <p className="section-desc">A full week of live Radio Jockeys — tap any show to meet the RJ.</p>
        </div>

        <div className="schedule-grid">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={label} className={`schedule-day ${i === TODAY_INDEX ? 'schedule-day--today' : ''}`}>
              <h3 className="schedule-day__label">{label}</h3>
              <div className="schedule-day__list">
                {byDay[i].length === 0 && <p className="schedule-day__empty">—</p>}
                {byDay[i].map((entry) => (
                  <button
                    type="button"
                    key={`${entry.slug}-${label}`}
                    className="schedule-slot"
                    onClick={() => setSelectedRj(entry)}
                  >
                    <span className="schedule-slot__time">{entry.time}</span>
                    <span className="schedule-slot__name">{entry.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {unscheduled.length > 0 && (
          <div className="schedule-extra">
            <h4>Also on air</h4>
            <div className="schedule-extra__list">
              {unscheduled.map((rj) => (
                <button type="button" key={rj.slug} className="schedule-slot" onClick={() => setSelectedRj(rj)}>
                  <span className="schedule-slot__time">{rj.time}</span>
                  <span className="schedule-slot__name">
                    {rj.name} · {rj.days}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <RJBioModal rj={selectedRj} onClose={() => setSelectedRj(null)} showListenLink />
    </section>
  );
}
