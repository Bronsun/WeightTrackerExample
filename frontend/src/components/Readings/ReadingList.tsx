import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteReading,
  fetchReadings,
  MassReading,
} from "../../queries/readings";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import dayjs from "dayjs";

interface ReadingsListProps {
  isKg: boolean;
}

export default function ReadingsList({ isKg }: ReadingsListProps) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<
    MassReading[],
    Error
  >({
    queryKey: ["readings"],
    queryFn: fetchReadings,
    refetchInterval: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: (date: string) =>
      deleteReading(date),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["readings"],
      }),
  });
  const convertMass = (kg: number) => {
    return isKg
      ? `${kg.toFixed(1)} kg`
      : `${(kg * 2.20462).toFixed(1)} lbs`;
  };

  if (isLoading)
    return (
      <CircularProgress style={{ margin: 20 }} />
    );
  if (error)
    return (
      <Typography color="error">
        Error: {error.message}
      </Typography>
    );

  const readings = data || [];
  const sorted = [...readings].sort((a, b) =>
    dayjs(a.date).diff(dayjs(b.date))
  );

  return (
    <>
      <Table style={{ marginTop: 20 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Mass</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((item) => (
            <TableRow key={item.date}>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                {convertMass(item.mass)}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    deleteMutation.mutate(
                      item.date
                    )
                  }
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>
                No readings yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
