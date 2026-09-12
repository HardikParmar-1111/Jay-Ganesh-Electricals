export type ProductCategory =
  | "All"
  | "Non-Modular Switches"
  | "Modular Switches"
  | "Boxes & Enclosures"
  | "Switchgears"
  | "Power Accessories"
  | "Switches"
  | "Boards"
  | "Wires"
  | "Fans"
  | "Coolers"
  | "Irons"
  | "Water Geysers";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  brand: string;
  image: string;
  gallery?: string[];
  specs: Record<string, string>;
  inStock: boolean;
  description: string;
}

export interface CategoryCardData {
  name: ProductCategory;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  highlight: string;
  itemCount: number;
}

export const CATEGORIES: ProductCategory[] = [
  "All",
  "Non-Modular Switches",
  "Modular Switches",
  "Boxes & Enclosures",
  "Switchgears",
  "Power Accessories",
  "Switches",
  "Boards",
  "Wires",
  "Fans",
  "Coolers",
  "Water Geysers",
];

export const FEATURED_CATEGORIES: CategoryCardData[] = [
  {
    name: "Modular Switches",
    slug: "modular-switches",
    tagline: "Architectural & Luxury",
    description: "Flame-retardant polycarbonate switches, broad rockers, and precision dimmers.",
    image: "/images/categories/modular-switches.png",
    highlight: "10-Year Warranty",
    itemCount: 3,
  },
  {
    name: "Boxes & Enclosures",
    slug: "boxes-enclosures",
    tagline: "Premium Wooden Boards",
    description: "Elegant wooden concealed boxes and distribution boards for luxury interiors.",
    image: "/images/categories/boxes-enclosures.png",
    highlight: "Handcrafted Quality",
    itemCount: 1,
  },
  {
    name: "Fans",
    slug: "fans",
    tagline: "High-Speed & Elegant",
    description: "Energy-efficient ceiling fans with premium metallic finishes and noiseless operation.",
    image: "/images/categories/fans.png",
    highlight: "5-Star Rated",
    itemCount: 1,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "Modular Switch",
    category: "Modular Switches",
    price: 75,
    brand: "Jay Ganesh Pro",
    image: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592652495632-421711df7798?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    ],
    specs: {
      "Rated Current": "10A",
      "Voltage Rating": "240V AC 50Hz",
      "Module Size": "1 Module",
      "Contact Material": "Silver Cadmium Oxide Inlay",
      "Body Material": "UV-Stabilized Polycarbonate (FR Grade)",
      "Standard Compliance": "IS 3854:1997",
      "Endurance": "Tested for over 100,000 electrical clicks",
      "Warranty": "10 Years Replacement Warranty",
    },
    inStock: true,
    description:
      "Premium 10A 1-Way flush-fit modular switch crafted from fire-retardant virgin polycarbonate with silver-inlay contact tips for smooth, spark-free switching.",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    name: "Broad Switch",
    category: "Modular Switches",
    price: 195,
    brand: "Jay Ganesh Pro",
    image: "https://images.unsplash.com/photo-1592652495632-421711df7798?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1592652495632-421711df7798?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    ],
    specs: {
      "Rated Current": "20A / 25A Heavy Duty",
      "Voltage Rating": "240V - 250V AC",
      "Module Size": "2 Module (Broad Rocker)",
      "Indicator": "Integrated Neon Power Indicator",
      "Contact Material": "Heavy Copper Terminals with Silver Bimetal",
      "Recommended Use": "Air Conditioners, Water Heaters, Induction Cooktops",
      "Standard Compliance": "IS 3854:1997",
      "Warranty": "10 Years Replacement Warranty",
    },
    inStock: true,
    description:
      "Heavy-duty 20A / 25A broad rocker switch engineered for high-wattage residential and commercial appliances including water geysers, air conditioners, and kitchen equipment.",
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    name: "Dimmer",
    category: "Modular Switches",
    price: 340,
    brand: "Jay Ganesh Pro",
    image: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592652495632-421711df7798?q=80&w=800&auto=format&fit=crop",
    ],
    specs: {
      "Power Rating": "400W Max Load",
      "Voltage Rating": "230V AC, 50Hz",
      "Module Size": "1 Module",
      "Control Type": "Capacitive Stepless Rotary Knob",
      "Noise Level": "100% Hum-Free Operation",
      "Thermal Protection": "Built-in Overheat Fuse Protection",
      "Application": "Ceiling Fans, Incandescent & Dimmable LED Fixtures",
      "Warranty": "5 Years Domestic Warranty",
    },
    inStock: true,
    description:
      "Full 360-degree stepless electronic rotary fan and lighting dimmer with hum-free capacitive speed modulation and energy-saving technology.",
  },
  {
    id: "a1b2c3d4-0004-4000-8000-000000000004",
    name: "MCB",
    category: "Switchgears",
    price: 285,
    brand: "Schneider / Jay Ganesh",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    ],
    specs: {
      "Pole Configuration": "Single Pole (1P)",
      "Current Rating": "16A / 32A Available",
      "Breaking Capacity": "10kA (10,000A) Heavy Industrial Grade",
      "Tripping Characteristic": "Type C Curve (5-10 In)",
      "Rated Voltage": "240V / 415V AC",
      "Mounting": "Standard 35mm DIN Rail Mount",
      "Standard Compliance": "IS/IEC 60898-1",
      "Warranty": "5 Years Manufacturer Warranty",
    },
    inStock: true,
    description:
      "Single Pole (SP) C-Curve Miniature Circuit Breaker designed for precise thermal-magnetic overload and short-circuit protection in residential and commercial distribution boards.",
  },
  {
    id: "a1b2c3d4-0005-4000-8000-000000000005",
    name: "RCCB",
    category: "Switchgears",
    price: 1980,
    brand: "Legrand / Jay Ganesh",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    ],
    specs: {
      "Pole Configuration": "4-Pole (4P for 3-Phase + Neutral)",
      "Rated Current (In)": "40A",
      "Sensitivity (IΔn)": "30mA (Life Saving Shock Protection)",
      "Operating Voltage": "415V AC, 50/60Hz",
      "Test Feature": "Push-to-Test Monthly Verification Button",
      "Standard Compliance": "IS 12640-1 / IEC 61008-1",
      "Application": "Whole Home Distribution Board Protection",
      "Warranty": "5 Years Manufacturer Warranty",
    },
    inStock: true,
    description:
      "4-Pole 40A 30mA Residual Current Circuit Breaker ensuring life-saving instantaneous protection against electrical shocks, earth leakages, and electrical fire hazards.",
  },
  {
    id: "a1b2c3d4-0006-4000-8000-000000000006",
    name: "AC Box",
    category: "Power Accessories",
    price: 580,
    brand: "Jay Ganesh Heavy Duty",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592652495632-421711df7798?q=80&w=800&auto=format&fit=crop",
    ],
    specs: {
      "Power Rating": "25A Heavy Duty (Up to 2.5 Ton AC)",
      "Socket Type": "Universal Multi-Pin Socket with Safety Shutters",
      "Isolator": "Built-in 25A DP Starter Switch / Mini MCB",
      "Enclosure": "Rust-Proof Galvanized Sheet Metal with Polycarbonate Faceplate",
      "Installation": "Concealed or Flush Wall Mount",
      "Surge Protection": "Integrated Line Spike Protection",
      "Warranty": "3 Years Warranty",
    },
    inStock: true,
    description:
      "Complete Modular AC starter power box featuring heavy-duty 25A MCB isolator, universal 3-pin power socket, and corrosion-resistant powder-coated concealed steel enclosure.",
  },
  {
    id: "a1b2c3d4-0007-4000-8000-000000000007",
    name: "Extension Box",
    category: "Power Accessories",
    price: 490,
    brand: "Jay Ganesh Pro",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop",
    ],
    specs: {
      "Outlets": "4 Universal Multi-Country Sockets with Safety Shutters",
      "Switches": "4 Dedicated Rocker Switches with Neon Indicators",
      "Cord Length": "3 Meters Heavy Gauge Copper Cable (10A Rated)",
      "Max Power Rating": "2500W - 10A Max Load",
      "Surge Suppression": "Up to 1050 Joules Transient Spike Protection",
      "Safety": "Thermal Overload Circuit Breaker with Manual Reset",
      "Housing": "Flame-Retardant ABS Enclosure",
      "Warranty": "2 Years Replacement Warranty",
    },
    inStock: true,
    description:
      "Heavy-duty 4-way master surge-protected extension box equipped with individual neon switches, universal sockets, and 3 meters of 100% pure electrolytic copper cable.",
  },
  {
    id: "p-001",
    name: "Anchor Roma Classic Switch",
    category: "Switches",
    price: 45,
    brand: "Anchor",
    image: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=600&auto=format&fit=crop",
    ],
    specs: {
      Amperage: "10A",
      Voltage: "240V",
      Material: "Polycarbonate",
      Color: "White",
    },
    inStock: true,
    description: "Premium quality modular switch for everyday home use.",
  },
  {
    id: "p-002",
    name: "Finolex 1.5 sq mm Wire (90m)",
    category: "Wires",
    price: 1250,
    brand: "Finolex",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
    ],
    specs: {
      Length: "90m",
      Core: "Copper",
      Color: "Red",
      Type: "FR PVC",
    },
    inStock: true,
    description: "Flame retardant PVC insulated industrial cables.",
  },
  {
    id: "p-003",
    name: "Havells Leganza Ceiling Fan",
    category: "Fans",
    price: 3200,
    brand: "Havells",
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop",
    ],
    specs: {
      Sweep: "1200mm",
      Power: "74W",
      Speed: "350 RPM",
      Color: "Bronze Gold",
    },
    inStock: true,
    description: "Elegant 4-blade fan with metallic paint finish.",
  },
  {
    id: "p-004",
    name: "Crompton Optimus Desert Cooler",
    category: "Coolers",
    price: 11500,
    brand: "Crompton",
    image: "https://images.unsplash.com/photo-1527660232535-61882d9735d4?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1527660232535-61882d9735d4?q=80&w=600&auto=format&fit=crop",
    ],
    specs: {
      Capacity: "65L",
      AirDelivery: "5500 CMH",
      CoolingPad: "Honeycomb",
      Power: "230W",
    },
    inStock: true,
    description: "High performance desert cooler with extra large ice chamber.",
  },
  {
    id: "p-005",
    name: "Bajaj Majesty Dry Iron",
    category: "Irons",
    price: 650,
    brand: "Bajaj",
    image: "https://images.unsplash.com/photo-1597518423604-e918451f28b4?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1597518423604-e918451f28b4?q=80&w=600&auto=format&fit=crop",
    ],
    specs: {
      Power: "1000W",
      Soleplate: "Non-stick coated",
      Cord: "360 degree swivel",
      Weight: "0.8kg",
    },
    inStock: true,
    description: "Lightweight dry iron with comfortable grip.",
  },
  {
    id: "p-006",
    name: "AO Smith 15L Storage Geyser",
    category: "Water Geysers",
    price: 7800,
    brand: "AO Smith",
    image: "https://images.unsplash.com/photo-1585640103730-179836173a11?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1585640103730-179836173a11?q=80&w=600&auto=format&fit=crop",
    ],
    specs: {
      Capacity: "15 Liters",
      Power: "2000W",
      StarRating: "5 Star",
      TankMaterial: "Blue Diamond Glass Lined",
    },
    inStock: true,
    description: "Energy efficient storage water heater for hard water.",
  },
  {
    id: "p-007",
    name: "Legrand Myrius 8 Module Board",
    category: "Boards",
    price: 320,
    brand: "Legrand",
    image: "https://images.unsplash.com/photo-1592652495632-421711df7798?q=80&w=600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1592652495632-421711df7798?q=80&w=600&auto=format&fit=crop",
    ],
    specs: {
      Modules: "8 Module",
      Material: "Polycarbonate",
      Color: "White",
      Type: "Surface Mount",
    },
    inStock: true,
    description: "Sleek and robust 8-module surface mounting box.",
  },
];

export interface ElectricalBundleKit {
  id: string;
  name: string;
  itemCount: number;
  priceRange: string;
  description: string;
  image: string;
}

export const ROOM_KITS: ElectricalBundleKit[] = [
  {
    id: "kit-1",
    name: "1BHK Standard Wiring Kit",
    itemCount: 24,
    priceRange: "₹8,500",
    description: "Complete modular switches, wires, and MCBs for a standard 1BHK.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "kit-2",
    name: "Kitchen Heavy Appliance Kit",
    itemCount: 8,
    priceRange: "₹2,200",
    description: "16A/20A sockets, heavy-duty switches, and A/C box enclosures.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "kit-3",
    name: "Smart Living Room Upgrade",
    itemCount: 14,
    priceRange: "₹5,500",
    description: "Smart touch switches, dimmers, and decorative fan plates.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "kit-4",
    name: "Bathroom & Geyser Kit",
    itemCount: 6,
    priceRange: "₹1,200",
    description: "Water-resistant enclosures and high-load switches.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
  },
];
