import { GoogleGenAI, Type } from "@google/genai";

export interface VibeResponse {
  mood_tags: string[];
  color_palette: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
  };
  recommended_locations: {
    id: string;
    name: string;
    country: string;
    description: string;
    aesthetic_reason: string;
    image_query: string;
    hotel: {
      name: string;
      description: string;
      how_to_get_there: string;
    };
    food: {
      dish_name: string;
      place_to_eat: string;
      description: string;
      location_details: string;
    };
    flights: {
      type: 'ECONOMY' | 'PREMIUM' | 'LUXURY';
      airline: string;
      estimated_price: string;
      baggage: {
        included: string;
        dimensions: string;
        weight: string;
      };
    }[];
    attractions: {
      name: string;
      description: string;
      type: string;
    }[];
  }[];
}

export async function interpretMood(
  prompt: string, 
  language: string = "ITALIANO", 
  budget?: { min: number, max: number },
  travelers?: { adults: number, children: number, pets: number },
  preferences?: { days: number, region: string }
): Promise<VibeResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const budgetContext = budget 
    ? `Il budget totale stimato per il viaggio (hotel + cibo per persona al giorno) deve essere compreso tra ${budget.min}€ e ${budget.max}€.`
    : "";
    
  const travelersContext = travelers
    ? `Il viaggio è per ${travelers.adults} adulti, ${travelers.children} bambini e ${travelers.pets} animali domestici. Assicurati che gli hotel e i voli siano adatti a questo gruppo e che i prezzi stimati riflettano il totale per questo numero di persone.`
    : "";

  const prefsContext = preferences
    ? `La durata del viaggio è di ${preferences.days} giorni. La regione preferita è: ${preferences.region} (es. "Italia", "Europa", "Fuori Europa", "Ovunque"). Suggerisci solo luoghi che rispettino questa preferenza geografica.`
    : "";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Interpreta questo mood di viaggio: "${prompt}". 
    Restituisci un oggetto JSON che catturi l'estetica e suggerisca 5 luoghi specifici in tutto il mondo che corrispondano perfettamente a questa vibrazione.
    ${budgetContext}
    ${travelersContext}
    ${prefsContext}
    Per ogni luogo, includi:
    1. Un hotel consigliato con istruzioni su come arrivarci (mezzi pubblici o taxi).
    2. Un piatto tipico con il posto migliore dove mangiarlo e dettagli su dove si trova esattamente.
    3. Tre opzioni di volo (ECONOMY, PREMIUM, LUXURY) con dettagli sulla compagnia aerea, prezzo stimato e regole precise per il bagaglio (misure e peso).
    4. Una lista di 3 attrazioni o punti di interesse imperdibili in quel luogo con una breve descrizione.
    IMPORTANTE: Tutte le descrizioni, i tag e le motivazioni estetiche devono essere in ${language.toUpperCase()}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood_tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: `Tag descrittivi del mood in ${language}`
          },
          color_palette: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING, description: "Codice esadecimale per elementi UI primari" },
              accent: { type: Type.STRING, description: "Codice esadecimale per accenti/evidenziazioni" },
              bg: { type: Type.STRING, description: "Codice esadecimale per lo sfondo principale" },
              text: { type: Type.STRING, description: "Codice esadecimale per il testo" }
            },
            required: ["primary", "accent", "bg", "text"]
          },
          recommended_locations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING, description: "Nome del luogo" },
                country: { type: Type.STRING, description: `Paese in ${language}` },
                description: { type: Type.STRING, description: `Descrizione dettagliata in ${language}` },
                aesthetic_reason: { type: Type.STRING, description: `Perché questo luogo corrisponde al mood, in ${language}` },
                image_query: { type: Type.STRING, description: "Una breve query per una foto di viaggio di alta qualità di questo luogo" },
                hotel: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nome dell'hotel consigliato" },
                    description: { type: Type.STRING, description: `Breve descrizione dell'hotel in ${language}` },
                    how_to_get_there: { type: Type.STRING, description: `Istruzioni su come arrivare all'hotel in ${language}` }
                  },
                  required: ["name", "description", "how_to_get_there"]
                },
                food: {
                  type: Type.OBJECT,
                  properties: {
                    dish_name: { type: Type.STRING, description: "Nome del piatto tipico" },
                    place_to_eat: { type: Type.STRING, description: "Nome del ristorante o mercato" },
                    description: { type: Type.STRING, description: `Descrizione del piatto in ${language}` },
                    location_details: { type: Type.STRING, description: `Dove si trova esattamente il posto in ${language}` }
                  },
                  required: ["dish_name", "place_to_eat", "description", "location_details"]
                },
                flights: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ["ECONOMY", "PREMIUM", "LUXURY"] },
                      airline: { type: Type.STRING },
                      estimated_price: { type: Type.STRING },
                      baggage: {
                        type: Type.OBJECT,
                        properties: {
                          included: { type: Type.STRING, description: `Cosa è incluso (es. "Solo zaino", "Bagaglio a mano", "Stiva") in ${language}` },
                          dimensions: { type: Type.STRING, description: "Dimensioni massime (es. 40x20x25 cm)" },
                          weight: { type: Type.STRING, description: "Peso massimo (es. 10kg)" }
                        },
                        required: ["included", "dimensions", "weight"]
                      }
                    },
                    required: ["type", "airline", "estimated_price", "baggage"]
                  }
                },
                attractions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Nome dell'attrazione" },
                      description: { type: Type.STRING, description: `Breve descrizione dell'attrazione in ${language}` },
                      type: { type: Type.STRING, description: `Tipo di attrazione (es. Museo, Parco, Monumento) in ${language}` }
                    },
                    required: ["name", "description", "type"]
                  }
                }
              },
              required: ["id", "name", "country", "description", "aesthetic_reason", "image_query", "hotel", "food", "flights", "attractions"]
            }
          }
        },
        required: ["mood_tags", "color_palette", "recommended_locations"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as VibeResponse;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid vibe data received");
  }
}
