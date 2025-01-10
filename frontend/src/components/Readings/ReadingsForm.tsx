import React, { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createReading,
  updateReading,
  MassReading,
} from "../../queries/readings";
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../../hook/useSnackBar";
import ConfirmationModal from "./ConfirmationModal";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface ReadingsFormProps {
  isKg: boolean;
}

export default function ReadingsForm({
  isKg,
}: ReadingsFormProps) {
  const [date, setDate] = useState<Dayjs>(
    dayjs()
  );
  const formattedDate = date.format("YYYY-MM-DD");

  const queryClient = useQueryClient();
  const [massKg, setMassKg] = useState<number>(0);
  const [
    showOverwriteModal,
    setShowOverwriteModal,
  ] = useState(false);

  const { showSnackbar, snackbarElement } =
    useSnackbar();

  const createMutation = useMutation({
    mutationFn: createReading,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["readings"],
      });
      showSnackbar(
        "Reading created successfully!",
        "success"
      );
    },
    onError: (error: unknown) => {
      showSnackbar(
        `Error creating reading: ${
          (error as Error).message
        }`,
        "error"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (reading: MassReading) =>
      updateReading(reading.date, reading),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["readings"],
      });
      showSnackbar(
        "Reading updated successfully!",
        "success"
      );
    },
    onError: (error: unknown) => {
      showSnackbar(
        `Error updating reading: ${
          (error as Error).message
        }`,
        "error"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !date.isValid()) {
      showSnackbar("Date is required!", "error");
      return;
    }
    if (date.isAfter(dayjs(), "day")) {
      showSnackbar(
        "Cannot use future dates",
        "error"
      );
      return;
    }
    if (massKg < 0) {
      showSnackbar(
        "Mass cannot be negative!",
        "error"
      );
      return;
    }
    if (massKg === 0) {
      showSnackbar(
        "Mass should be higher than 0",
        "warning"
      );
      return;
    }

    const reading: MassReading = {
      date: formattedDate,
      mass: massKg,
    };

    const existing = queryClient
      .getQueryData<MassReading[]>(["readings"])
      ?.find((r) => r.date === formattedDate);

    if (existing) {
      setShowOverwriteModal(true);
    } else {
      createMutation.mutate(reading);
    }
  };

  const handleConfirmOverwrite = () => {
    updateMutation.mutate({
      date: formattedDate.toString(),
      mass: massKg,
    });
    setShowOverwriteModal(false);
  };

  const handleClear = () => {
    setDate(date);
    setMassKg(0);
  };

  const convertInputToKg = (val: number) =>
    isKg ? val : val / 2.20462;
  const convertKgToDisplay = (kg: number) =>
    isKg ? kg : (kg * 2.20462).toFixed(1);

  return (
    <>
      {snackbarElement}

      <ConfirmationModal
        open={showOverwriteModal}
        onClose={() =>
          setShowOverwriteModal(false)
        }
        onConfirm={() => handleConfirmOverwrite()}
        title="Do you wish to overwrite?"
        content={`There is already a reading in ${formattedDate}. Do you wish to overwrite it?`}
      />

      <Typography variant="h6" gutterBottom>
        Add reading
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        maxWidth={300}
      >
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
        >
          <DatePicker
            label="Date"
            value={date}
            format="YYYY-MM-DD"
            onChange={(newValue) => {
              if (newValue) setDate(newValue);
            }}
            maxDate={dayjs()}
          />
        </LocalizationProvider>
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
            onClick={handleSubmit}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            fullWidth
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </>
  );
}
