export type Car = {
  id: string; make: string; model: string; year: number; price: number; mileage: number;
  type: 'Sedan' | 'SUV' | 'Coupe'; fuel: 'Gasoline' | 'Electric' | 'Hybrid'; transmission: string;
  image: any; location: string; seller: string; badge?: string; color: string; description: string;
  horsepower: number; featured?: boolean; own?: boolean;
};

export const cars: Car[] = [
  { id: 'bmw-m4', make: 'BMW', model: 'M4 Competition', year: 2023, price: 72490, mileage: 8420, type: 'Coupe', fuel: 'Gasoline', transmission: 'Automatic', image: require('../assets/images/bmw.jpg'), location: 'San Francisco, CA', seller: 'Bay Area Auto Collective', badge: 'Drivn pick', color: 'Alpine White', horsepower: 503, featured: true, description: 'A little more extraordinary, every day. This beautifully maintained M4 Competition pairs exhilarating performance with a thoughtfully appointed cabin. Finished in Alpine White, with a carbon-fiber roof, premium sound, and a full service history.' },
  { id: 'porsche-panamera', make: 'Porsche', model: 'Panamera 4', year: 2023, price: 86900, mileage: 12800, type: 'Sedan', fuel: 'Gasoline', transmission: 'Automatic', image: require('../assets/images/porsche.jpg'), location: 'San Jose, CA', seller: 'Peninsula Motor Company', badge: 'Featured', color: 'Jet Black Metallic', horsepower: 325, featured: true, description: 'The soul of a sports car, with room for your whole life. This Panamera 4 brings together all-wheel-drive confidence, a panoramic roof, and an exceptionally refined interior. One owner, meticulously cared for, and ready for its next chapter.' },
  { id: 'mercedes-gt', make: 'Mercedes-Benz', model: 'AMG GT', year: 2022, price: 94500, mileage: 16350, type: 'Coupe', fuel: 'Gasoline', transmission: 'Automatic', image: require('../assets/images/mercedes.jpg'), location: 'Oakland, CA', seller: 'East Bay European', badge: 'Low mileage', color: 'Selenite Grey', horsepower: 523, description: 'Distinctive from every angle. This AMG GT combines a hand-built engine with a beautifully finished interior, performance exhaust, and a driver-focused cockpit. A weekend escape you can enjoy every day.' },
  { id: 'tesla-model3', make: 'Tesla', model: 'Model 3 Long Range', year: 2023, price: 32900, mileage: 21400, type: 'Sedan', fuel: 'Electric', transmission: 'Automatic', image: require('../assets/images/tesla.jpg'), location: 'San Francisco, CA', seller: 'Alex Chen', badge: 'Drivn pick', color: 'Pearl White', horsepower: 346, description: 'Your everyday, recharged. A clean, one-owner Model 3 with all-wheel drive, a panoramic glass roof, premium audio, and a minimalist interior. Charging cable included. The perfect companion for city commutes and coastal weekends.' },
  { id: 'audi-rs7', make: 'Audi', model: 'RS 7 Sportback', year: 2022, price: 81750, mileage: 18700, type: 'Sedan', fuel: 'Gasoline', transmission: 'Automatic', image: require('../assets/images/audi.jpg'), location: 'Palo Alto, CA', seller: 'Peninsula Motor Company', color: 'Mythos Black', horsepower: 591, description: 'Uncompromising performance meets effortless practicality. With quattro all-wheel drive, a sport differential, premium leather, and an expansive hatchback, this RS 7 is designed to make every journey feel special.' },
  { id: 'range-rover', make: 'Land Rover', model: 'Range Rover Sport', year: 2023, price: 76990, mileage: 15200, type: 'SUV', fuel: 'Hybrid', transmission: 'Automatic', image: require('../assets/images/range-rover.jpg'), location: 'Marin County, CA', seller: 'Marin Luxury Motors', badge: 'Featured', color: 'Velocity Blue', horsepower: 395, description: 'Take the scenic route. This Range Rover Sport offers confident capability, an elevated driving position, and the comfort of a beautifully crafted cabin. Includes panoramic roof, heated seats, and a full suite of driver assistance features.' },
];

export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
export const miles = (n: number) => n.toLocaleString('en-US') + ' mi';
export const monthly = (price: number, down = 0.2, months = 72) => {
  const rate = 0.065 / 12;
  return Math.round((price * (1 - down) * rate) / (1 - Math.pow(1 + rate, -months)));
};
export const categories = ['All cars', 'SUV', 'Sedan', 'Coupe', 'Electric'] as const;
export type Filters = { query: string; min: string; max: string; type: string; fuel: string; make: string };
export const defaultFilters: Filters = { query: '', min: '', max: '', type: 'All', fuel: 'All', make: 'All' };
export type Message = { id: string; text: string; mine: boolean; time: string };
export type Conversation = { id: string; carId: string; name: string; initials: string; unread: boolean; messages: Message[] };
export const initialConversations: Conversation[] = [
  { id: 'thread-bmw', carId: 'bmw-m4', name: 'Bay Area Auto Collective', initials: 'BA', unread: true, messages: [
    { id: 'm1', text: 'Hi! Is the M4 still available? I’d love to take a closer look.', mine: true, time: '10:24 AM' },
    { id: 'm2', text: 'Hi Alex! Yes, it is. It’s a beautiful car with a full service history. Happy to answer any questions or arrange a viewing.', mine: false, time: '10:32 AM' },
  ] },
  { id: 'thread-tesla', carId: 'tesla-model3', name: 'Alex Chen', initials: 'AC', unread: false, messages: [
    { id: 'm3', text: 'Hello! Does the charging cable come with the car?', mine: true, time: 'Yesterday' },
    { id: 'm4', text: 'Absolutely! The mobile charging cable and both key cards are included.', mine: false, time: 'Yesterday' },
  ] },
];
