// ReadingForm.tsx
import React, {
  useEffect,
  useState,
} from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createReading,
  updateReading,
  MassReading,
} from "../queries/readings";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
} from "@mui/material";

interface ReadingFormProps {
  initialReading?: MassReading;
  isKg: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReadingForm({
  initialReading,
  isKg,
  onSuccess,
}: ReadingFormProps) {
  const queryClient = useQueryClient();

  const [date, setDate] = useState("");
  const [massKg, setMassKg] = useState<number>(0);
  const [
    showOverwriteModal,
    setShowOverwriteModal,
  ] = useState(false);

  useEffect(() => {
    if (initialReading) {
      setDate(initialReading.date);
      setMassKg(initialReading.mass);
    } else {
      setDate("");
      setMassKg(0);
    }
  }, [initialReading]);

  const createMutation = useMutation({
    mutationFn: createReading,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["readings"],
      });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (reading: MassReading) =>
      updateReading(reading.date, reading),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["readings"],
      });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert("Date is required");
      return;
    }
    if (massKg <= 0) {
      alert("Mass must be positive");
      return;
    }

    const reading: MassReading = {
      date,
      mass: massKg,
    };

    if (initialReading) {
      updateMutation.mutate(reading);
      return;
    }
    const existing = queryClient
      .getQueryData<MassReading[]>(["readings"])
      ?.find((r) => r.date === date);

    if (existing) {
      setShowOverwriteModal(true);
    } else {
      createMutation.mutate(reading);
    }
  };

  const handleConfirmOverwrite = () => {
    updateMutation.mutate({ date, mass: massKg });
    setShowOverwriteModal(false);
  };

  const convertInputToKg = (val: number) =>
    isKg ? val : val / 2.20462;
  const convertKgToDisplay = (kg: number) =>
    isKg ? kg : kg * 2.20462;

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    minWidth: 300,
  };

  return (
    <>
      <Modal
        open={showOverwriteModal}
        onClose={() =>
          setShowOverwriteModal(false)
        }
      >
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Overwrite existing reading?
          </Typography>
          <Typography>
            A reading for <strong>{date}</strong>
            already exists. Overwrite?
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleConfirmOverwrite}
            >
              Overwrite
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setShowOverwriteModal(false)
              }
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Add reading
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          maxWidth={300}
        >
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            required
          />
          <TextField
            label={
              isKg ? "Mass (kg)" : "Mass (lbs)"
            }
            type="number"
            value={convertKgToDisplay(
              massKg
            ).toString()}
            onChange={(e) => {
              const val = parseFloat(
                e.target.value
              );
              setMassKg(convertInputToKg(val));
            }}
            required
          />
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Add
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
}
