"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Action", value: 35, color: "#8884d8" },
  { name: "Drama", value: 25, color: "#82ca9d" },
  { name: "Comedy", value: 20, color: "#ffc658" },
  { name: "Sci-Fi", value: 12, color: "#ff7c7c" },
  { name: "Horror", value: 8, color: "#8dd1e1" },
];

export function GenreChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
