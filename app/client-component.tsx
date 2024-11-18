/*
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientComponent() {
  const router = useRouter();

  useEffect(() => {
    // Funkce pro získání země na základě souřadnic
    const fetchCountryFromCoordinates = async (
      latitude: number,
      longitude: number
    ) => {
      try {
        const response = await fetch("/api/geo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude, longitude }),
        });

        const data = await response.json();

        if (data.country) {
          // Nastavení jazyka podle zjištěné země
          switch (data.country) {
            case "Czech Republic":
              router.push("/cs"); // Přesměruje na českou verzi webu
              break;
            case "Germany":
              router.push("/de"); // Přesměruje na německou verzi webu
              break;
            default:
              router.push("/en"); // Výchozí jazyk (angličtina)
          }
        } else {
          router.push("/en"); // Pokud nelze zjistit zemi, přesměruje na výchozí jazyk
        }
      } catch (error) {
        console.error("Failed to fetch country:", error);
        router.push("/en"); // Výchozí jazyk v případě chyby
      }
    };

    // Získání polohy uživatele pomocí Geolocation API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCountryFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          router.push("/en"); // Výchozí jazyk, pokud uživatel zamítne geolokaci nebo dojde k chybě
        }
      );
    } else {
      router.push("/en"); // Výchozí jazyk, pokud geolokace není podporována
    }
  }, [router]);

  return null; // Tato komponenta nezobrazuje žádný obsah, jen spravuje logiku
}
*/
