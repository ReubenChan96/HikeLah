'use client';

import { useEffect, useState } from 'react';

interface WeatherWidgetProps {
  lat: number | null;
  lng: number | null;
  regionKey: string;
}

interface NowcastArea {
  name: string;
  label_location: { latitude: number; longitude: number };
}

interface ForecastPeriod {
  timePeriod: { start: string; end: string };
  regions: Record<string, string>;
}

const FORECAST_ICONS: Record<string, string> = {
  'fair':                   'fas fa-sun',
  'sunny':                  'fas fa-sun',
  'partly cloudy':          'fas fa-cloud-sun',
  'cloudy':                 'fas fa-cloud',
  'overcast':               'fas fa-cloud',
  'hazy':                   'fas fa-smog',
  'light showers':          'fas fa-cloud-rain',
  'showers':                'fas fa-cloud-showers-heavy',
  'heavy showers':          'fas fa-cloud-showers-heavy',
  'thundery showers':       'fas fa-bolt',
  'heavy thundery showers': 'fas fa-bolt',
  'windy':                  'fas fa-wind',
  'light rain':             'fas fa-cloud-rain',
  'moderate rain':          'fas fa-cloud-rain',
  'heavy rain':             'fas fa-cloud-showers-heavy',
};

function getWeatherIcon(forecast: string): string {
  const lower = forecast.toLowerCase();
  for (const [key, cls] of Object.entries(FORECAST_ICONS)) {
    if (lower.includes(key)) return cls;
  }
  return 'fas fa-cloud-sun';
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatPeriod(start: string, end: string): string {
  const fmt = (t: Date) => t.toLocaleTimeString('en-SG', { hour: 'numeric', hour12: true });
  return `${fmt(new Date(start))} – ${fmt(new Date(end))}`;
}

export default function WeatherWidget({ lat, lng, regionKey }: WeatherWidgetProps) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [areaName, setAreaName] = useState('');
  const [areaForecast, setAreaForecast] = useState('');
  const [periods, setPeriods] = useState<{ time: string; icon: string; label: string }[]>([]);

  useEffect(() => {
    async function load() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const [r1, r2] = await Promise.all([
          fetch('https://api-open.data.gov.sg/v2/real-time/api/two-hr-weather', { signal: controller.signal }),
          fetch('https://api-open.data.gov.sg/v2/real-time/api/24hr-weather', { signal: controller.signal }),
        ]);
        const nowcast = await r1.json();
        const forecast = await r2.json();

        // Nowcast — find nearest area
        const items = nowcast?.data?.items?.[0];
        const areaMeta: NowcastArea[] = nowcast?.data?.area_metadata ?? [];
        let nearestArea = '';
        let nearestForecast = '';

        if (items && lat && lng) {
          let minDist = Infinity;
          for (const area of areaMeta) {
            const d = haversine(lat, lng, area.label_location.latitude, area.label_location.longitude);
            if (d < minDist) { minDist = d; nearestArea = area.name; }
          }
          const match = (items.forecasts as { area: string; forecast: string }[])
            .find(f => f.area === nearestArea);
          if (match) nearestForecast = match.forecast;
        }

        setAreaName(nearestArea);
        setAreaForecast(nearestForecast);

        // 24hr forecast periods
        const record = forecast?.data?.records?.[0];
        if (record?.periods) {
          setPeriods((record.periods as ForecastPeriod[]).map(p => ({
            time:  formatPeriod(p.timePeriod.start, p.timePeriod.end),
            icon:  getWeatherIcon(p.regions?.[regionKey] ?? p.regions?.central ?? ''),
            label: p.regions?.[regionKey] ?? p.regions?.central ?? '—',
          })));
        }

        setStatus('ok');
      } catch {
        setStatus('error');
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
  }, [lat, lng, regionKey]);

  return (
    <div>
      {status === 'loading' && (
        <p className="text-gray-500 text-sm">
          <i className="fas fa-spinner fa-spin mr-1" />Loading weather…
        </p>
      )}

      {status === 'error' && (
        <p className="text-gray-500 text-sm">Weather data unavailable.</p>
      )}

      {status === 'ok' && (
        <>
          {/* Nowcast card */}
          <div className="flex items-center gap-4 bg-gradient-to-br from-brand-pale to-[#f0f7e6] rounded-xl p-4 mb-3">
            <i className={`${getWeatherIcon(areaForecast)} text-4xl text-brand-dark`} />
            <div>
              <div className="font-bold text-brand-dark text-sm">{areaName}</div>
              <div className="text-[#4a5568] text-sm mt-0.5">{areaForecast || '—'}</div>
            </div>
          </div>

          {/* 24hr periods */}
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
            Today&apos;s forecast
          </p>
          <div className="flex flex-wrap gap-2">
            {periods.map((p, i) => (
              <div
                key={i}
                className="flex-1 min-w-[90px] bg-gray-50 border border-gray-200 rounded-xl p-3 text-center"
              >
                <div className="text-[10px] text-gray-500 mb-1">{p.time}</div>
                <i className={`${p.icon} text-brand-light text-xl block mb-1`} />
                <div className="text-[11px] font-medium text-[#4a5568]">{p.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-[11px] text-gray-400 mt-2">Source: data.gov.sg</p>
    </div>
  );
}
