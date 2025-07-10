"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jul", movies: 8 },
  { month: "Aug", movies: 12 },
  { month: "Sep", movies: 15 },
  { month: "Oct", movies: 18 },
  { month: "Nov", movies: 22 },
  { month: "Dec", movies: 25 },
];

export function MovieStatsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="movies"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
