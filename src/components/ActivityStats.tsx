import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import _ from "lodash";
import { Training } from "../types";

type ChartData = {
  activity: string;
  duration: number;
};

export default function ActivityStats() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings")
      .then(res => res.json())
      .then((data: Training[]) => {
        const grouped = _.groupBy(data, "activity");
        const result = Object.keys(grouped).map(activity => ({
          activity,
          duration: _.sumBy(grouped[activity], t => Number(t.duration))
        }));
        setChartData(result);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="activity" />
          <YAxis label={{ value: "Duration (min)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="duration" fill="rgba(100,100,255,0.6)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
