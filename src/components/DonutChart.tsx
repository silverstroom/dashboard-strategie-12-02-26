import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  label?: string;
}

const DonutChart = ({ data, innerRadius = 35, outerRadius = 55, height = 140, label }: DonutChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={0}
          dataKey="value"
          stroke="#fff"
          label={({ name, percent, fill, cx: labelCx, cy: labelCy, midAngle, outerRadius: or }) => {
            const RADIAN = Math.PI / 180;
            const radius = (or || 55) + 20;
            const x = (labelCx as number) + radius * Math.cos(-midAngle * RADIAN);
            const y = (labelCy as number) + radius * Math.sin(-midAngle * RADIAN);
            const displayPercent = Math.round((percent || 0) * 100);
            if (displayPercent === 0) return null;
            return (
              <text
                x={x}
                y={y}
                fill={fill}
                textAnchor={x > (labelCx as number) ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs font-medium"
              >
                {name} {displayPercent}%
              </text>
            );
          }}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
