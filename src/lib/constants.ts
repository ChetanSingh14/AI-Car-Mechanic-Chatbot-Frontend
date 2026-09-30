import { MechanicPartner, OBDCode } from '../types';

export const POPULAR_VEHICLE_MAKES = [
  'Honda',
  'Toyota',
  'Ford',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Chevrolet',
  'Hyundai',
  'Nissan',
  'Volkswagen',
  'Subaru',
  'Kia',
  'Mazda',
  'Tesla',
  'Jeep',
  'Lexus',
  'Porsche',
  'Volvo'
];

export const POPULAR_MODELS_BY_MAKE: Record<string, string[]> = {
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Fit', 'Odyssey'],
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Prius'],
  Ford: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Bronco', 'Focus'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', 'M3', 'M5', '7 Series', '4 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class', 'CLA'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'e-tron', 'S4'],
  Chevrolet: ['Silverado 1500', 'Malibu', 'Equinox', 'Tahoe', 'Suburban', 'Corvette', 'Camaro'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Ioniq 5'],
  Nissan: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Maxima', 'Murano'],
  Volkswagen: ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'GTI', 'ID.4'],
  Subaru: ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'WRX', 'Ascent', 'BRZ'],
  Kia: ['Forte', 'Optima/K5', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'EV6'],
  Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-30', 'CX-9', 'CX-50', 'MX-5 Miata'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Gladiator', 'Renegade'],
  Lexus: ['RX 350', 'ES 350', 'NX 300', 'IS 300', 'GX 460', 'UX 250h'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman'],
  Volvo: ['XC90', 'XC60', 'XC40', 'S60', 'V60', 'S90']
};

export const QUICK_SYMPTOMS = [
  {
    title: 'High Pitch Squeal on Braking',
    prompt: 'My brakes make a high-pitched squealing noise whenever I apply gentle pressure at low speeds.',
    icon: 'disc',
    category: 'Brakes'
  },
  {
    title: 'Check Engine Light & Rough Idle',
    prompt: 'The check engine light came on and the engine is vibrating and idling roughly when stopped at red lights.',
    icon: 'engine',
    category: 'Engine'
  },
  {
    title: 'Rattling Noise Underneath at 40mph',
    prompt: 'I hear a metallic rattling / buzzing noise from beneath the car when accelerating past 40 mph.',
    icon: 'volume',
    category: 'Exhaust'
  },
  {
    title: 'AC Blowing Warm Air',
    prompt: 'The air conditioner is blowing ambient/warm air even when set to maximum cold and the compressor seems to cycle quickly.',
    icon: 'wind',
    category: 'Climate'
  },
  {
    title: 'Engine Overheating / Coolant Smell',
    prompt: 'The temperature gauge shot up near the red zone and I smell a sweet syrupy odor coming from the engine bay.',
    icon: 'flame',
    category: 'Cooling'
  },
  {
    title: 'Slow Cranking / Battery Dead',
    prompt: 'The car turns over very slowly before starting in the morning, and the interior dashboard lights dim.',
    icon: 'zap',
    category: 'Electrical'
  }
];

export const CERTIFIED_MECHANIC_PARTNERS: MechanicPartner[] = [
  {
    id: 'mech-1',
    name: 'Precision Master Automotive & Diagnostics',
    rating: 4.9,
    reviews_count: 248,
    distance: '1.4 miles away',
    address: '420 West Industrial Blvd, Suite A',
    specialties: ['ASE Master Certified', 'OBD-II Electrical', 'Brake Systems', 'Engine Diagnostics'],
    hourly_rate: '$110/hr',
    is_certified: true
  },
  {
    id: 'mech-2',
    name: 'Apex EuroTech & Import Specialists',
    rating: 4.8,
    reviews_count: 182,
    distance: '2.8 miles away',
    address: '880 Silicon Parkway, Tech District',
    specialties: ['German & Japanese Imports', 'Transmission', 'Turbochargers', 'Air Conditioning'],
    hourly_rate: '$135/hr',
    is_certified: true
  },
  {
    id: 'mech-3',
    name: 'Mobile Fleet Pro (On-Site Repair)',
    rating: 4.9,
    reviews_count: 310,
    distance: 'Comes to your location',
    address: 'Mobile Van Dispatch (Within 15 miles)',
    specialties: ['Mobile On-Site Service', 'Brakes & Rotors', 'Battery & Starter', 'Fluid Flush'],
    hourly_rate: '$120/hr',
    is_certified: true
  }
];

export const COMMON_OBD_CODES: OBDCode[] = [
  {
    code: 'P0300',
    category: 'Powertrain',
    title: 'Random / Multiple Cylinder Misfire Detected',
    symptoms: ['Engine jerking', 'Loss of power', 'Flashing check engine light'],
    severity: 'high'
  },
  {
    code: 'P0420',
    category: 'Powertrain',
    title: 'Catalytic Converter System Efficiency Below Threshold (Bank 1)',
    symptoms: ['Reduced fuel economy', 'Sulfur/rotten egg exhaust smell', 'CEL on'],
    severity: 'medium'
  },
  {
    code: 'P0171',
    category: 'Powertrain',
    title: 'System Too Lean (Bank 1)',
    symptoms: ['Hesitation under acceleration', 'Rough idle', 'Engine pinging'],
    severity: 'medium'
  },
  {
    code: 'P0128',
    category: 'Powertrain',
    title: 'Coolant Thermostat (Coolant Temp Below Regulating Temperature)',
    symptoms: ['Heater blowing lukewarm', 'Engine running cooler than normal', 'Decreased MPG'],
    severity: 'low'
  },
  {
    code: 'P0455',
    category: 'Powertrain',
    title: 'Evaporative Emission System Leak Detected (Gross Leak)',
    symptoms: ['Loose gas cap warning', 'Fuel odor near vehicle rear', 'CEL on'],
    severity: 'low'
  },
  {
    code: 'P0700',
    category: 'Powertrain',
    title: 'Transmission Control System (Malfunction Indicator Lamp Request)',
    symptoms: ['Delayed gear shifts', 'Transmission slipping', 'Limp home mode'],
    severity: 'critical'
  }
];
