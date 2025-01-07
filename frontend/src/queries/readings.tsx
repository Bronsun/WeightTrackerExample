export interface MassReading {
  date: string;
  mass: number;
}

const URL = process.env.REACT_APP_API_URL;

export async function fetchReadings(): Promise<
  MassReading[]
> {
  const response = await fetch(
    `${URL}/readings/`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch readings");
  }
  return response.json();
}
