import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchReadings,
  MassReading,
} from "../queries/readings";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Typography,
} from "@mui/material";

function ReadingListSimple(){
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
        Error: {error.message}
      </Typography>
    );

  if (!data || data.length === 0) {
    return (
      <Typography>No readings yet.</Typography>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Readings
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Mass (kg)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((reading) => (
            <TableRow key={reading.date}>
              <TableCell>
                {reading.date}
              </TableCell>
              <TableCell>
                {reading.mass.toFixed(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ReadingListSimple;
