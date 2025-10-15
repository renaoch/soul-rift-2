export interface Product {
  id: number;
  name: string;
  price: number;
  texture: string;
  color: string;
  description: string;
  collection: string;
  rating: number;
  sales: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    bg: string;
    text: string;
    accent: string;
  };
}

export const products: Product[] = [
  { 
    id: 1, 
    name: "BROCK", 
    price: 89, 
    texture: "/design10.png", 
    color: "Midnight Black",
    description: "Limited edition print inspired by underground culture",
    collection: "WINTER '25",
    rating: 4.8,
    sales: "2.3k",
    theme: {
      primary: "#ff6b35",
      secondary: "#f7931e",
      background: "#0a0a0a",
      surface: "#1a1a1a",
      bg: "#0a0a0a",
      text: "#ffffff",
      accent: "#ff6b35"
    }
  },
  { 
    id: 2, 
    name: "VOLTAGE", 
    price: 92, 
    texture: "/design2.png", 
    color: "Cyber Blue",
    description: "Electric design for the future-forward",
    collection: "CYBER SERIES",
    rating: 4.9,
    sales: "3.1k",
    theme: {
      primary: "#00d9ff",
      secondary: "#0066ff",
      background: "#050505",
      surface: "#151515",
      bg: "#050505",
      text: "#ffffff",
      accent: "#00d9ff"
    }
  },
  { 
    id: 3, 
    name: "INFERNO", 
    price: 95, 
    texture: "/BrockDesign.png", 
    color: "Lava Red",
    description: "Fire meets fabric in this explosive design",
    collection: "HEAT WAVE",
    rating: 4.7,
    sales: "1.9k",
    theme: {
      primary: "#ff3131",
      secondary: "#ff6b00",
      background: "#0d0000",
      surface: "#1d0000",
      bg: "#0d0000",
      text: "#ffffff",
      accent: "#ff3131"
    }
  },
  { 
    id: 4, 
    name: "TOXIC", 
    price: 88, 
    texture: "/design11.png", 
    color: "Acid Green",
    description: "Biohazard aesthetic meets street culture",
    collection: "HAZMAT",
    rating: 4.6,
    sales: "1.5k",
    theme: {
      primary: "#39ff14",
      secondary: "#ccff00",
      background: "#000a00",
      surface: "#001a00",
      bg: "#000a00",
      text: "#ffffff",
      accent: "#39ff14"
    }
  },
];
