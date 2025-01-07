import { useState } from "react";
import ReadingList from "./components/ReadingList";
import { MassReading } from "./queries/readings";
import ReadingForm from "./components/ReadingsForm";
import {
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

function App() {
  const [unit, setUnit] = useState<"kg" | "lbs">(
    "kg"
  );
  const [editingReading, setEditingReading] =
    useState<MassReading | undefined>(undefined);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h1" fontSize={24}>
        Weight Tracker Example
      </Typography>
      <Typography fontSize={16}>
        Choose measure unit
      </Typography>
      <RadioGroup
        row
        value={unit}
        onChange={(e) =>
          setUnit(e.target.value as "kg" | "lbs")
        }
        sx={{ mb: 2 }}
      >
        <FormControlLabel
          value="kg"
          control={<Radio />}
          label="KG"
        />
        <FormControlLabel
          value="lbs"
          control={<Radio />}
          label="LBS"
        />
      </RadioGroup>

      <ReadingForm
        initialReading={editingReading}
        isKg={unit === "kg"}
        onSuccess={() => {
          setEditingReading(undefined);
        }}
        onCancel={() =>
          setEditingReading(undefined)
        }
      />
      <ReadingList isKg={unit === "kg"} />
    </Container>
  );
}

export default App;
