import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchReadings,
  MassReading,
} from "../../queries/readings";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CircularProgress,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

interface WeightScatterChartProps {
  isKg: boolean;
}

export default function WeightScatterChart({
  isKg,
}: WeightScatterChartProps): JSX.Element {
  const { data, isLoading, error } = useQuery<
    MassReading[],
    Error
  >({
    queryKey: ["readings"],
    queryFn: fetchReadings,
  });

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <Typography color="error">
        Error loading chart data: {error.message}
      </Typography>
    );

  const chartData = (data || []).map(
    (reading) => ({
      x: dayjs(reading.date).valueOf(),
      y: isKg
        ? reading.mass
        : reading.mass * 2.20462,
    })
  );

  return (
    <ResponsiveContainer
      width="100%"
      height={500}
    >
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="x"
          type="number"
          domain={["auto", "auto"]}
          tickFormatter={(tick: number) =>
            dayjs(tick).format("YYYY-MM-DD")
          }
          label={{
            value: "Date",
            position: "insideBottom",
            offset: -10,
          }}
        />
        <YAxis
          dataKey="y"
          type="number"
          label={{
            value: isKg
              ? "Mass (kg)"
              : "Mass (lbs)",
            angle: -90,
            position: "insideLeft",
            offset: 10,
          }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (
              active &&
              payload &&
              payload.length
            ) {
              const { x, y } = payload[0].payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    padding: "5px",
                  }}
                >
                  <p>
                    Date:{" "}
                    {dayjs(x).format(
                      "YYYY-MM-DD"
                    )}
                  </p>
                  <p>
                    Mass: {y.toFixed(1)}{" "}
                    {isKg ? "kg" : "lbs"}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          name="Weight"
          data={chartData}
          fill="#8884d8"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
