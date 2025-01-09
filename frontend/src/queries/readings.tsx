export interface MassReading { //TODO move to models
  date: string;
  mass: number;
}

const URL = process.env.REACT_APP_API_URL;


async function handleError(response: Response): Promise<void> { //TODO never
  let errorMessage = response.statusText || 'Unknown error';
  try {
    const errorData = await response.json();
    if (errorData.message) {
      errorMessage = errorData.message;
    } else {
      errorMessage = JSON.stringify(errorData);
    }
  } catch (err) {
    errorMessage = "Error parsing JSON"
  }
  throw new Error(errorMessage);
}

// GET /readings []
export async function fetchReadings(): Promise<
  MassReading[]
> {
  const response = await fetch(
    `${URL}/readings/`
  );
  if (!response.ok) {
    await handleError(response)
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
    await handleError(response)
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
    await handleError(response)
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
    await handleError(response)
  }
}
