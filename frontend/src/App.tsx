import React, { useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ReadingList from "./components/Readings/ReadingList";
import ReadingForm from "./components/Readings/ReadingsForm";
import WeightScatterChart from "./components/Chart/WeightScatterChart";
import TabPanel from "./components/Tab/TabPanel";

export default function App() {
  const [unit, setUnit] = useState<"kg" | "lbs">(
    "kg"
  );
  const isKg = unit === "kg";
  const [selectedTab, setSelectedTab] =
    useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Weight Tracker
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
      <ReadingForm isKg={isKg} />
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="sections"
        style={{
          backgroundColor: "#e6e6e6",
          marginTop: 20,
        }}
      >
        <Tab
          label="List"
          id="tab-0"
          aria-controls="tabpanel-0"
        />
        <Tab
          label="Chart"
          id="tab-1"
          aria-controls="tabpanel-1"
        />
      </Tabs>
      <TabPanel value={selectedTab} index={0}>
        <ReadingList isKg={isKg} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <WeightScatterChart isKg={isKg} />
      </TabPanel>
    </Container>
  );
}
