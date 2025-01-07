export interface MassReading {
  date: string;
  mass: number;
}

const URL = process.env.REACT_APP_API_URL;

// GET /readings []
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

// POST /readings
export async function createReading(
  newReading: MassReading
): Promise<MassReading> {
  const response = await fetch(
    `${URL}/readings/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReading),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Failed to create/overwrite reading"
    );
  }
  return response.json();
}

// PUT /readings/{date}
export async function updateReading(
  date: string,
  updated: MassReading
): Promise<MassReading> {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/readings/${date}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update reading");
  }
  return response.json();
}

// DELETE /readings/{date}
export async function deleteReading(
  date: string
): Promise<void> {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/readings/${date}/`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete reading");
  }
}
