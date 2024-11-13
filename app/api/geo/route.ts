/*import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude } = await req.json();

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { message: "Latitude and longitude are required." },
        { status: 400 }
      );
    }

    // Simulace zpětného geokódování (vrácení země na základě souřadnic)
    // V reálném nasazení byste použili např. službu jako OpenStreetMap nebo jinou API službu.
    let country = "Unknown";

    if (latitude > 48 && latitude < 51 && longitude > 12 && longitude < 18) {
      country = "Czech Republic"; // Simulace detekce země
    }

    return NextResponse.json({ country });
  } catch (error) {
    // Přidána kontrola typu chyby
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred.", error: error.message },
        { status: 500 }
      );
    } else {
      // Pokud chyba není instance třídy Error
      return NextResponse.json(
        { message: "An unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
*/
