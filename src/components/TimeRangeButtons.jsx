export default function TimeRangeButtons({ currentRange, onChange }) {
  const timeRanges = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentRange === range.value
              ? 'bg-green-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}