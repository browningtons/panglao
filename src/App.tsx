import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Gift, User, Coffee, Shield, Map as MapIcon, Utensils, Mountain, Anchor, Sunset, Droplet, Heart, AlertTriangle, ArrowRight, CloudRain, Sun, Thermometer, CheckSquare, Banknote, Coins, Wallet, Users, Clock, Car } from 'lucide-react';

// --- TYPES ---

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'base' | 'adventure' | 'solo' | 'chill' | 'food';
  desc: string;
}

interface ItineraryItem {
  date: string;
  title: string;
  time: string;
  icon: React.ElementType;
  type: 'travel' | 'activity';
  details: string;
}

interface WingmanCard {
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ElementType;
}

interface WingmanSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  cards?: WingmanCard[];
  content?: React.ReactNode;
}

interface MoneyIntelPoint {
  label: string;
  desc: string;
}

interface MoneyIntelSection {
  title: string;
  icon: React.ElementType;
  color: string;
  points: MoneyIntelPoint[];
}

interface Day {
  id: string;
  date: string;
  label: string;
  main: boolean;
}

interface Activity {
  id: string;
  title: string;
  type: 'Group' | 'Solo' | 'Couple';
  dist: string;
  duration: string;
  desc: string;
}

interface PreSlotted {
  [key: string]: string[];
}

// --- DATA ---

const ITINERARY_DATA: ItineraryItem[] = [
  { date: "Fri, Dec 26", title: "Depart Seattle", time: "9:30 PM", icon: Plane, type: "travel", details: "Flight PR125. 14.5h Long Haul to MNL. Bring neck pillow & compression socks." },
  { date: "Sun, Dec 28", title: "The Arrival Gauntlet", time: "1:20 PM", icon: MapPin, type: "travel", details: "Land in Panglao (TAG) via MNL & DVO. Check into Napaling Airbnb." },
  { date: "Mon, Dec 29", title: "Backyard Sardines", time: "All Day", icon: Anchor, type: "activity", details: "Acclimatize. Snorkel the Napaling Sardine Run (stairs at cliff). Dinner @ Ubeco?" },
  { date: "Tue, Dec 30", title: "The Big Three", time: "8:00 AM", icon: Mountain, type: "activity", details: "1. Chocolate Hills (ATV recommended). 2. Tarsier Sanctuary (Corella). 3. Loboc River Cruise (Lunch)." },
  { date: "Wed, Dec 31", title: "Island Hopping", time: "6:00 AM", icon: Utensils, type: "activity", details: "Balicasag Island (Sea Turtles) & Virgin Island (Sea Urchin/Banana Queue)." },
  { date: "Fri, Jan 2", title: "The Champion Run", time: "4:00 AM", icon: User, type: "activity", details: "Alicia Panoramic Park (The Ridge Run) OR Lamanoc Island (Mystical Caves)." },
  { date: "Tue, Jan 6", title: "Return Journey", time: "11:00 AM", icon: Plane, type: "travel", details: "TAG -> MNL (Danger Zone Layover) -> YVR -> SEA." },
];

const MAP_LOCATIONS: MapLocation[] = [
  // BASE
  { id: 'napaling', name: 'Napaling Reef (Base)', lat: 9.6105, lng: 123.7703, type: 'base', desc: 'Airbnb, Sardine Run & Cliff Stairs' },
  
  // ADVENTURE
  { id: 'chocolates', name: 'Chocolate Hills', lat: 9.8297, lng: 124.1398, type: 'adventure', desc: 'ATV & Viewing Deck Complex' },
  { id: 'tarsier', name: 'Tarsier Sanctuary', lat: 9.6917, lng: 123.9536, type: 'adventure', desc: 'Corella Sanctuary (The ethical one)' },
  { id: 'loboc', name: 'Loboc River Cruise', lat: 9.6373, lng: 124.0322, type: 'adventure', desc: 'Floating Restaurants & River Tour' },
  { id: 'balicasag', name: 'Balicasag Island', lat: 9.5178, lng: 123.6811, type: 'adventure', desc: 'Marine Sanctuary (Sea Turtles)' },
  { id: 'virgin', name: 'Virgin Island', lat: 9.5562, lng: 123.7303, type: 'adventure', desc: 'Sandbar with food stalls (Sea Urchin)' },

  // SOLO / MYSTICAL
  { id: 'alicia', name: 'Alicia Panoramic Park', lat: 9.9079, lng: 124.4578, type: 'solo', desc: 'The Ridge Run (Binabaje Hills). 2.5h drive.' },
  { id: 'lamanoc', name: 'Lamanoc Island', lat: 9.8033, lng: 124.5966, type: 'solo', desc: 'Mystical Shaman Caves & Red Hematite Art' },
  { id: 'hinagdanan', name: 'Hinagdanan Cave', lat: 9.6234, lng: 123.8040, type: 'solo', desc: 'Limestone cave with swimmable lagoon' },

  // CHILL
  { id: 'northzen', name: 'North Zen Villas', lat: 9.5936, lng: 123.7432, type: 'chill', desc: 'Bamboo Sunset Walk (Mangroves)' },
  { id: 'molave', name: 'Molave Cliff Resort', lat: 9.6133, lng: 123.7725, type: 'chill', desc: 'Cliff diving board & chill ocean access' },
  { id: 'dauis', name: 'Dauis Church', lat: 9.6258, lng: 123.8650, type: 'chill', desc: 'Church with miraculous fresh water well' },

  // FOOD
  { id: 'alona', name: 'Alona Beach', lat: 9.5484, lng: 123.7766, type: 'food', desc: 'Tourist Hub, Bars, Nightlife' },
  { id: 'beefarm', name: 'Bohol Bee Farm', lat: 9.5872, lng: 123.8169, type: 'food', desc: 'Organic food on a cliff. Great sunset dinner.' },
  { id: 'ubeco', name: 'Ubeco', lat: 9.5761, lng: 123.7667, type: 'food', desc: 'Top-rated fusion comfort food.' },
  { id: 'mist', name: 'Mist', lat: 9.5568, lng: 123.7699, type: 'food', desc: 'Instagrammable Jungle Cafe' },
  { id: 'barwoo', name: 'Barwoo', lat: 9.5512, lng: 123.7645, type: 'food', desc: 'Korean Bistro (Very popular)' },
];

const LEGEND_ITEMS = [
  { type: 'base', label: 'Base Camp', color: 'blue' },
  { type: 'adventure', label: 'Adventure', color: 'green' },
  { type: 'solo', label: 'Paul Solo', color: 'purple' },
  { type: 'chill', label: 'Chill / Zen', color: 'teal' },
  { type: 'food', label: 'Food / Hub', color: 'orange' },
];

const WINGMAN_SECTIONS: WingmanSection[] = [
  {
    id: 'solo',
    title: 'Solo Missions & Escapes',
    icon: User,
    color: 'blue',
    cards: [
      { title: "Alicia Panoramic Park", subtitle: "The Champion Move", desc: "The 'Ridge Run'. Jagged green mountain views (The Binabaje Hills). Steep, technical, epic. 2.5hrs away.", icon: Mountain },
      { title: "Lamanoc Island", subtitle: "The Mystical Deep Dive", desc: "The 'Island of Shaman' in Anda. Red hematite cave paintings, boat coffins, and 'woo-woo' vibes.", icon: MapIcon },
      { title: "Hinagdanan Cave", subtitle: "Quick Escape", desc: "Limestone cave with a fresh/brackish lagoon you can swim in. 15 mins from Napaling.", icon: Droplet },
      { title: "North Zen Villas", subtitle: "Sunset Zen", desc: "500m bamboo boardwalk through mangroves. Best sunset spot. Day pass available.", icon: Sunset },
    ]
  },
  {
    id: 'wellness',
    title: 'Maintenance (Run & Yoga)',
    icon: Heart,
    color: 'emerald',
    cards: [
      { title: "Morning Run", subtitle: "Tangnan Coastal Road", desc: "Paved, quiet, runs along the cliffs. Go early (5:30 AM) to beat the heat.", icon: User },
      { title: "Jing Yoga", subtitle: "Alona Beach", desc: "Nice shala with drop-in classes. Good escape if the family house gets chaotic.", icon: Coffee },
      { title: "Dauis Church", subtitle: "Miraculous Well", desc: "Spanish-era church with a fresh water well inside (despite being next to the ocean).", icon: Shield },
    ]
  },
  {
    id: 'dining',
    title: 'Food Intel',
    icon: Utensils,
    color: 'orange',
    cards: [
      { title: "Bohol Bee Farm", subtitle: "Must Visit", desc: "Organic food on a cliff. Try the 'Malunggay' ice cream. Great for family dinner.", icon: Utensils },
      { title: "Ubeco", subtitle: "Near Napaling", desc: "Rated high for fusion comfort food. Good lunch spot.", icon: Utensils },
      { title: "Mist", subtitle: "Vibe Check", desc: "Jungle cafe vibe. Good for coffee, cocktails, and Wi-Fi.", icon: Coffee },
      { title: "Alona Beach", subtitle: "Nightlife", desc: "The party hub. Fire dancers and busy bars if you need noise.", icon: Anchor },
    ]
  },
  {
    id: 'culture',
    title: 'Protocol & Gifts',
    icon: Gift,
    color: 'purple',
    content: (
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><Gift size={16}/> The Peace Offerings (Pasalubong)</h4>
          <ul className="text-sm text-purple-800 space-y-2">
            <li>• <strong>Titas:</strong> Bath & Body Works, Perfumes, Ferrero Rocher.</li>
            <li>• <strong>Titos:</strong> Duty Free Whisky, Baseball Caps.</li>
            <li className="pt-2 border-t border-purple-200 mt-2">
              <strong>⚠️ Golden Rule:</strong> Don't let Brother pay for everything at dinner. Offer to bring dessert.
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="font-bold text-slate-700 text-sm">"Mano Po"</div>
            <div className="text-xs text-slate-500 mt-1">Hand to forehead greeting for elders. Shows massive respect.</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="font-bold text-slate-700 text-sm">"Kain Tayo"</div>
            <div className="text-xs text-slate-500 mt-1">"Let's eat". Always accept at least a small bite.</div>
          </div>
        </div>
      </div>
    )
  }
];

const MONEY_INTEL: MoneyIntelSection[] = [
  {
    title: "General Rules",
    icon: Shield,
    color: "blue",
    points: [
      { label: "Cash is King", desc: "Resorts accept cards, but tricycles, street food, and small shops are CASH ONLY." },
      { label: "Small Bills", desc: "Break your 1000s at 7-Eleven or restaurants. Drivers often can't change a 500 or 1000 for a small fare." },
      { label: "ATMs", desc: "Fees are around ₱250 ($4.50) per withdrawal for foreign cards. Max withdrawal is usually ₱10k-20k. BPI and BDO are reliable banks." }
    ]
  },
  {
    title: "What Things Cost",
    icon: Coins,
    color: "green",
    points: [
      { label: "Tricycle Ride", desc: "₱20-50 ($0.40-$0.90) for short hops. ₱200-300 ($3.50-$5.50) for longer chartered rides (e.g. to airport)." },
      { label: "Scooter Rental", desc: "₱400-600 ($7-$11) per day. Cheaper for weekly rentals." },
      { label: "Meals", desc: "Street food: ₱50-100 ($1-2). Casual sit-down: ₱300-500 ($5-9). Fancy resort dinner: ₱1000+ ($18+)." },
      { label: "Beer", desc: "San Miguel is cheap! ₱60-100 ($1-2) in bars." }
    ]
  },
  {
    title: "Tipping Culture",
    icon: Banknote,
    color: "orange",
    points: [
      { label: "Not Mandatory", desc: "Tipping isn't strictly required but highly appreciated." },
      { label: "Restaurants", desc: "Check for 'Service Charge' (SC) on bill. If included, no need to tip extra. If not, leave ₱20-50 or loose change." },
      { label: "Tour Guides", desc: "₱200-500 ($3.50-$9) per group for a good day tour." },
      { label: "Tricycles", desc: "Round up. If fare is ₱45, give ₱50." }
    ]
  }
];

// --- ITINERARY DATA ---
const DAYS: Day[] = [
  { id: '29', date: 'Mon, Dec 29', label: 'Chill Day', main: true },
  { id: '30', date: 'Tue, Dec 30', label: 'Big Adventure', main: true },
  { id: '31', date: 'Wed, Dec 31', label: 'Island Hop', main: true },
  { id: '01', date: 'Thu, Jan 1', label: 'Recovery', main: false },
  { id: '02', date: 'Fri, Jan 2', label: 'Solo Mission', main: true },
];

const ACTIVITY_BANK: Activity[] = [
  { id: 'sardines', title: "Napaling Sardine Run", type: "Group", dist: "0km", duration: "2h", desc: "Snorkel just off the cliff. Millions of fish." },
  { id: 'choc', title: "Chocolate Hills ATV", type: "Group", dist: "75km", duration: "4h", desc: "Muddy, fun, iconic. Best way to see the hills." },
  { id: 'tarsier', title: "Tarsier Sanctuary", type: "Group", dist: "40km", duration: "1h", desc: "Tiny primates. Corella sanctuary is the ethical one." },
  { id: 'loboc', title: "Loboc River Lunch", type: "Group", dist: "50km", duration: "2h", desc: "Buffet on a floating raft. Touristy but relaxing." },
  { id: 'balicasag', title: "Balicasag Turtles", type: "Group", dist: "Boat", duration: "6h", desc: "Marine sanctuary. Guaranteed sea turtles." },
  { id: 'alicia', title: "Alicia Ridge Run", type: "Solo", dist: "95km", duration: "Day", desc: "Epic trail run. Technical ridges. Stunning views." },
  { id: 'lamanoc', title: "Lamanoc Mystical Tour", type: "Solo", dist: "100km", duration: "Day", desc: "Caves, shamans, red hematite paintings." },
  { id: 'northzen', title: "North Zen Sunset", type: "Couple", dist: "12km", duration: "2h", desc: "Bamboo walk. Perfect for romantic sunset." },
  { id: 'cave', title: "Hinagdanan Cave", type: "Group", dist: "5km", duration: "1h", desc: "Swim in a limestone cave lagoon." },
  { id: 'bee', title: "Bohol Bee Farm", type: "Group", dist: "8km", duration: "3h", desc: "Dinner on a cliff. Organic food & ice cream." },
];

const PRE_SLOTTED: PreSlotted = {
  '29': ['sardines', 'bee'],
  '30': ['choc', 'tarsier', 'loboc'],
  '31': ['balicasag'],
  '01': ['northzen'],
  '02': ['alicia']
};

// --- HELPER FUNCTIONS ---

function getThemeClasses(color: string) {
  switch (color) {
    case 'blue': return { text: 'text-blue-700', bg: 'bg-blue-100', border: 'border-l-blue-500', dot: 'bg-blue-400' };
    case 'green': return { text: 'text-green-700', bg: 'bg-green-100', border: 'border-l-green-500', dot: 'bg-green-400' };
    case 'emerald': return { text: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-l-emerald-500', dot: 'bg-emerald-400' };
    case 'orange': return { text: 'text-orange-700', bg: 'bg-orange-100', border: 'border-l-orange-500', dot: 'bg-orange-400' };
    case 'purple': return { text: 'text-purple-700', bg: 'bg-purple-100', border: 'border-l-purple-500', dot: 'bg-purple-400' };
    case 'teal': return { text: 'text-teal-700', bg: 'bg-teal-100', border: 'border-l-teal-500', dot: 'bg-teal-400' };
    default: return { text: 'text-slate-700', bg: 'bg-slate-100', border: 'border-l-slate-500', dot: 'bg-slate-400' };
  }
}

// --- COMPONENTS ---

interface ActivityCardProps {
  activity: Activity | undefined;
  isBank?: boolean;
}

function ActivityCard({ activity, isBank = false }: ActivityCardProps) {
  if (!activity) return null;
  return (
    <div className={`p-3 rounded-xl border mb-2 bg-white shadow-sm flex flex-col gap-1 ${isBank ? 'border-slate-200' : 'border-blue-200 bg-blue-50'}`}>
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-slate-800 text-sm leading-tight">{activity.title}</h4>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
          activity.type === 'Solo' ? 'bg-purple-100 text-purple-700' :
          activity.type === 'Couple' ? 'bg-pink-100 text-pink-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {activity.type}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-snug">{activity.desc}</p>
      <div className="flex gap-3 mt-1.5 pt-1.5 border-t border-slate-100/50">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Car size={10} /> {activity.dist}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Clock size={10} /> {activity.duration}
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  subtitle?: string;
  desc: string | React.ReactNode;
  icon: React.ElementType;
  alert?: boolean;
}

function Card({ title, subtitle, desc, icon: Icon, alert }: CardProps) {
  return (
    <div className={`p-4 rounded-xl border ${alert ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className={`font-bold ${alert ? 'text-red-800' : 'text-slate-800'}`}>{title}</h4>
          {subtitle && <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{subtitle}</p>}
        </div>
        {Icon && <Icon className={alert ? "text-red-400" : "text-blue-500"} size={20} />}
      </div>
      <div className={`text-sm ${alert ? 'text-red-700' : 'text-slate-600'}`}>{desc}</div>
    </div>
  );
}

interface FlightLegProps {
  from: string;
  to: string;
  flight: string;
  duration: string;
  alert?: boolean;
  isLayover?: string;
}

function FlightLeg({ from, to, flight, duration, alert, isLayover }: FlightLegProps) {
  return (
    <div className="relative pl-6 pb-6 border-l-2 border-slate-200 last:border-0 last:pb-0">
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${alert ? 'bg-red-100 border-red-500' : 'bg-white border-blue-500'}`}></div>
      
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-slate-800 text-sm">{from} <span className="text-slate-400">→</span> {to}</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{flight}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-600">{duration}</div>
        </div>
      </div>

      {isLayover && (
        <div className={`mt-2 text-xs p-2 rounded ${alert ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
          {alert && <AlertTriangle size={12} className="inline mr-1 -mt-0.5"/>}
          {isLayover}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('itinerary');
  const [mapLocation, setMapLocation] = useState<MapLocation>(MAP_LOCATIONS[0]); 
  const [selectedDay, setSelectedDay] = useState<string>('30'); // Default to Adventure Day
  
  const daysLeft = Math.ceil((new Date('2025-12-26').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Helper to get color based on type
  const getPinColor = (type: MapLocation['type']) => {
    switch(type) {
      case 'base': return 'bg-blue-600 text-white';
      case 'adventure': return 'bg-green-600 text-white';
      case 'solo': return 'bg-purple-600 text-white';
      case 'chill': return 'bg-teal-500 text-white';
      case 'food': return 'bg-orange-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getBorderColor = (type: MapLocation['type']) => {
    switch(type) {
      case 'base': return 'border-blue-600';
      case 'adventure': return 'border-green-600';
      case 'solo': return 'border-purple-600';
      case 'chill': return 'border-teal-500';
      case 'food': return 'border-orange-500';
      default: return 'border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR (Desktop Fixed) */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:bg-white md:border-r md:border-slate-200 z-50">
        <div className="flex items-center gap-2 p-6 border-b border-slate-100">
          <div className="bg-blue-600 text-white p-2 rounded-lg"><Plane size={20} /></div>
          <div>
            <h1 className="font-bold text-lg">Bohol 2026</h1>
            <p className="text-xs text-slate-500">Brown Brothers Trip</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {['itinerary', 'wingman', 'flights', 'money', 'map'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'itinerary' && <Calendar size={18} />}
              {tab === 'wingman' && <User size={18} />}
              {tab === 'flights' && <Plane size={18} />}
              {tab === 'money' && <Wallet size={18} />}
              {tab === 'map' && <MapIcon size={18} />}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-white p-4 border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg"><Plane size={16} /></div>
            <span className="font-bold text-slate-800">Bohol 2026</span>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            {daysLeft} Days To Go
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full pb-24 md:pb-8">
          
          {/* ITINERARY VIEW (NEW BUILDER) */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <header className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Itinerary Builder</h2>
                <p className="text-slate-500">Mix and match the days.</p>
              </header>

              {/* Trip Timeline (uses ITINERARY_DATA) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <h3 className="font-bold text-slate-800 mb-3">Trip Timeline</h3>

                  <div className="space-y-3">
                    {ITINERARY_DATA.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex gap-3 items-start">
                          <Icon className="h-5 w-5 text-slate-500 mt-1" />
                          <div>
                            <div className="text-xs text-slate-500">
                              {item.date} • {item.time}
                            </div>
                            <div className="font-semibold text-slate-800">
                              {item.title}
                            </div>
                            <div className="text-sm text-slate-600">
                              {item.details}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
              {/* DATE SELECTOR */}
              <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                {DAYS.map(day => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl border text-left min-w-[120px] transition-all ${
                      selectedDay === day.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${selectedDay === day.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {day.label}
                    </div>
                    <div className="font-bold text-sm">{day.date}</div>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* LEFT: PLANNED DAY */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Calendar size={18} className="text-blue-600"/> 
                      Planned for {DAYS.find(d => d.id === selectedDay)?.date.split(',')[0]}
                    </h3>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {PRE_SLOTTED[selectedDay]?.length || 0} Items
                    </span>
                  </div>
                  
                  {PRE_SLOTTED[selectedDay]?.length > 0 ? (
                    PRE_SLOTTED[selectedDay].map(actId => {
                      const activity = ACTIVITY_BANK.find(a => a.id === actId);
                      return <ActivityCard key={actId} activity={activity} />;
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                      Nothing scheduled. Drag items here!
                    </div>
                  )}
                </div>

                {/* RIGHT: ACTIVITY BANK */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-slate-400"/> Activity Bank
                  </h3>
                  <div className="space-y-2">
                    {ACTIVITY_BANK.filter(a => !PRE_SLOTTED[selectedDay]?.includes(a.id)).map(activity => (
                      <ActivityCard key={activity.id} activity={activity} isBank={true} />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* WINGMAN VIEW */}
          {activeTab === 'wingman' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <header>
                <h2 className="text-2xl font-bold text-slate-900">Wingman Protocols</h2>
                <p className="text-slate-500">Solo missions, gifts, and survival guides.</p>
              </header>

              {WINGMAN_SECTIONS.map((section) => (
                <section key={section.id} className="space-y-4">
                  <h3 className={`font-bold text-lg flex items-center gap-2 ${getThemeClasses(section.color).text}`}>
                    <section.icon size={20} />
                    {section.title}
                  </h3>
                  
                  {section.content ? section.content : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {section.cards?.map((card, idx) => (
                        <Card 
                          key={idx}
                          title={card.title} 
                          subtitle={card.subtitle} 
                          desc={card.desc} 
                          icon={card.icon} 
                        />
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* FLIGHTS VIEW */}
          {activeTab === 'flights' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <header>
                <h2 className="text-2xl font-bold text-slate-900">Flight Logistics</h2>
                <p className="text-slate-500">SEA - MNL - DVO - TAG</p>
              </header>

              {/* WEATHER WIDGET */}
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2"><Sun size={20}/> Panglao Forecast</h3>
                    <p className="text-blue-100 text-sm">Typical Jan Weather (Amihan Season)</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">29°C</div>
                    <div className="text-xs text-blue-100">High</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-white/20 rounded p-2 backdrop-blur-sm">
                    <CloudRain size={16} className="mx-auto mb-1"/>
                    <span>Chance Rain</span>
                  </div>
                  <div className="bg-white/20 rounded p-2 backdrop-blur-sm">
                    <Thermometer size={16} className="mx-auto mb-1"/>
                    <span>Low 24°C</span>
                  </div>
                  <div className="bg-white/20 rounded p-2 backdrop-blur-sm">
                    <AlertTriangle size={16} className="mx-auto mb-1"/>
                    <span>UV High</span>
                  </div>
                </div>
              </div>

              {/* CHECKLIST */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2"><CheckSquare size={18}/> Before You Fly</h4>
                <ul className="space-y-2 text-sm text-yellow-900">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span><strong>eTravel Registration:</strong> Mandatory for Philippines entry. Register at <a href="https://etravel.gov.ph" target="_blank" className="underline decoration-yellow-500">etravel.gov.ph</a> within 72h of flight.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span><strong>Download Grab App:</strong> Link your credit card before leaving US.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span><strong>Pasalubong Packed?</strong> Chocolates for kids, Whisky/Perfume for adults.</span>
                  </li>
                </ul>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                 {/* OUTBOUND CARD */}
                 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Plane size={18} className="text-blue-500"/> Outbound</h3>
                      <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">Dec 26-28</span>
                    </div>
                    <div className="space-y-1">
                      <FlightLeg from="SEA" to="MNL" flight="PR125" duration="14h 35m" />
                      <FlightLeg 
                        from="MNL (T1)" to="DVO" flight="PR2813" duration="1h 55m" 
                        isLayover="Layover: 4h 45m (Change Terminals T1->T2)" 
                      />
                      <FlightLeg 
                        from="DVO" to="TAG" flight="PR2372" duration="1h 00m" 
                        isLayover="Layover: 1h 35m (Short Connection!)" 
                        alert={true}
                      />
                    </div>
                 </div>

                 {/* RETURN CARD */}
                 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Plane size={18} className="text-orange-500"/> Return</h3>
                      <span className="text-xs font-mono bg-orange-50 text-orange-700 px-2 py-1 rounded">Jan 6</span>
                    </div>
                    <div className="space-y-1">
                      <FlightLeg from="TAG" to="MNL (T2)" flight="PR2774" duration="1h 30m" />
                      <FlightLeg 
                        from="MNL (T1)" to="YVR" flight="PR116" duration="11h 35m" 
                        isLayover="Layover: 7h 50m (The Danger Zone)" 
                        alert={true}
                      />
                      <FlightLeg 
                        from="YVR" to="SEA" flight="AS2122" duration="1h 06m" 
                        isLayover="Layover: 3h 40m" 
                      />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* MONEY INTEL VIEW */}
          {activeTab === 'money' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <header>
                <h2 className="text-2xl font-bold text-slate-900">Money Intel</h2>
                <p className="text-slate-500">PHP Survival Guide</p>
              </header>

              <div className="grid gap-6 md:grid-cols-1">
                {MONEY_INTEL.map((section, idx) => {
                  const theme = getThemeClasses(section.color);
                  return (
                    <div key={idx} className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 ${theme.border}`}>
                      <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${theme.text}`}>
                        <section.icon size={20} />
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} mt-2 shrink-0`}></div>
                            <div>
                              <span className="font-bold text-slate-800 block text-sm">{point.label}</span>
                              <span className="text-sm text-slate-600 leading-relaxed">{point.desc}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MAP VIEW */}
          {activeTab === 'map' && (
            <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500 relative">
              <header className="shrink-0 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Interactive Map</h2>
                  <p className="text-slate-500">Click a location to fly.</p>
                </div>
                {/* LEGEND (Desktop/Tablet) */}
                <div className="hidden sm:flex gap-2 text-[10px] font-bold uppercase tracking-wide">
                  {LEGEND_ITEMS.map(item => {
                    const theme = getThemeClasses(item.color);
                    return (
                      <div key={item.type} className={`px-2 py-1 rounded ${theme.bg} ${theme.text}`}>
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </header>

              {/* LOCATIONS LIST SCROLLABLE */}
              <div className="shrink-0 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                <div className="flex gap-3 w-max">
                  {MAP_LOCATIONS.map((loc) => {
                    const isActive = mapLocation.id === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setMapLocation(loc)}
                        className={`flex flex-col items-start p-3 rounded-xl border min-w-[160px] transition-all text-left group ${
                          isActive
                            ? `${getPinColor(loc.type)} shadow-lg scale-105 border-transparent` 
                            : `bg-white text-slate-700 hover:border-${getBorderColor(loc.type).split('-')[1]}-300 border-slate-200`
                        }`}
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isActive ? 'opacity-80' : 'text-slate-400'}`}>
                          {loc.type}
                        </span>
                        <span className="font-bold text-sm leading-tight">{loc.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* MAP EMBED */}
              <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative bg-slate-100">
                  <iframe 
                    key={mapLocation.id} 
                    src={`https://maps.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}&z=14&output=embed`}
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bohol Map"
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                  
                  {/* Floating Info Card - MOVED TO BOTTOM LEFT to avoid Google Maps UI */}
                  <div className="absolute bottom-4 left-4 max-w-xs bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl border border-white/50 animate-in slide-in-from-bottom-4 duration-300">
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2 inline-block ${
                       mapLocation.type === 'base' ? 'bg-blue-100 text-blue-700' :
                       mapLocation.type === 'adventure' ? 'bg-green-100 text-green-700' :
                       mapLocation.type === 'food' ? 'bg-orange-100 text-orange-700' :
                       mapLocation.type === 'solo' ? 'bg-purple-100 text-purple-700' :
                       'bg-teal-100 text-teal-700'
                     }`}>
                        {mapLocation.type}
                     </span>
                     <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                        {mapLocation.name}
                     </h3>
                     <p className="text-sm text-slate-600 leading-relaxed">{mapLocation.desc}</p>
                     
                     <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${mapLocation.lat},${mapLocation.lng}`}
                        target="_blank"
                        rel="noreferrer" 
                        className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                     >
                        Open in Google Maps <ArrowRight size={12}/>
                     </a>
                  </div>

                  {/* LEGEND (Mobile Overlay) */}
                  <div className="absolute top-4 right-4 sm:hidden flex flex-col gap-1 items-end pointer-events-none">
                    {LEGEND_ITEMS.map(item => {
                      const theme = getThemeClasses(item.color);
                      return (
                        <div key={item.type} className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-white/90 backdrop-blur shadow-sm border border-white/50 ${theme.text}`}>
                          {item.label}
                        </div>
                      );
                    })}
                  </div>
              </div>
            </div>
          )}
        </main>

        {/* MOBILE NAV BOTTOM */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          {['itinerary', 'wingman', 'flights', 'money', 'map'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                activeTab === tab ? 'text-blue-600 scale-105' : 'text-slate-400'
              }`}
            >
              {tab === 'itinerary' && <Calendar size={20} />}
              {tab === 'wingman' && <User size={20} />}
              {tab === 'flights' && <Plane size={20} />}
              {tab === 'money' && <Wallet size={20} />}
              {tab === 'map' && <MapIcon size={20} />}
              <span className="text-[10px] font-medium mt-1 capitalize">{tab}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  </div>  

  );
}