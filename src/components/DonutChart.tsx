import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  innerRadius?: number;
  outerRadius?: number;
}

const DonutChart = ({ data, innerRadius = 50, outerRadius = 70 }: DonutChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
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
