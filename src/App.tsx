import React, { useState } from 'react';
import { 
  Plane, MapPin, Calendar, Gift, User, Coffee, Shield, 
  Map as MapIcon, Utensils, Mountain, Anchor, 
  AlertTriangle, 
  CheckSquare, Coins, Wallet, 
  Users, Car, Smartphone
} from 'lucide-react';

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

interface WingmanSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
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

interface Activity {
  id: string;
  title: string;
  category: 'Group' | 'Solo' | 'Chill';
  audience: string;     // Who
  mode: string;         // What (Guided vs Self)
  travelTime: string;   // How long to get there
  duration: string;     // Total activity time
  desc: string;
  cost?: string;
}

// --- DATA ---

const ITINERARY_DATA: ItineraryItem[] = [
  { date: "Fri, Dec 26", title: "Depart Seattle", time: "9:30 PM", icon: Plane, type: "travel", details: "Flight PR125. 14.5h Long Haul to MNL. Bring neck pillow & compression socks." },
  { date: "Sun, Dec 28", title: "The Arrival Gauntlet", time: "1:20 PM", icon: MapPin, type: "travel", details: "Land in Panglao (TAG) via MNL & DVO. Check into Napaling Airbnb." },
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
  // CHILL (Mapping these to Solo/Chill for the filter)
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

const ACTIVITY_BANK: Activity[] = [
  // GROUP
  { id: 'sardines', title: "Napaling Sardine Run", category: "Group", audience: "Everyone", mode: "Self-Guided (Stairs)", travelTime: "0 min (On-site)", duration: "1-2 Hours", desc: "Snorkel just off the cliff base. Millions of sardines. Best in the morning.", cost: "Free / Gear Rental" },
  { id: 'choc', title: "Chocolate Hills ATV", category: "Group", audience: "Family/Group", mode: "Guided Tour", travelTime: "90 min (Van)", duration: "3 Hours", desc: "Muddy, fun, iconic. Best way to see the hills instead of just the viewing deck.", cost: "₱1,500/pax" },
  { id: 'tarsier', title: "Tarsier Sanctuary", category: "Group", audience: "Family", mode: "Guided Walk", travelTime: "45 min (Van)", duration: "45 Mins", desc: "Corella sanctuary (the ethical one). Short walk, strict silence required.", cost: "₱150/pax" },
  { id: 'loboc', title: "Loboc River Lunch", category: "Group", audience: "Family/Group", mode: "River Cruise", travelTime: "60 min (Van)", duration: "2 Hours", desc: "Buffet on a floating raft. Very touristy but relaxing and classic.", cost: "₱850/pax" },
  { id: 'balicasag', title: "Balicasag Turtles", category: "Group", audience: "Everyone", mode: "Boat Charter", travelTime: "45 min (Boat)", duration: "Half Day", desc: "Marine sanctuary with guaranteed sea turtles. Snorkel gear required.", cost: "₱3,000/boat" },
  
  // SOLO
  { id: 'alicia', title: "Alicia Ridge Run", category: "Solo", audience: "Solo/Fit", mode: "Extreme Hike", travelTime: "2.5 Hours (Scooter)", duration: "Full Day", desc: "The Binabaje Hills. Epic, technical trail running. Jagged green ridges.", cost: "₱300 guide" },
  { id: 'lamanoc', title: "Lamanoc Mystical Tour", category: "Solo", audience: "Solo/Explorer", mode: "Guided History", travelTime: "2.5 Hours (Scooter)", duration: "3 Hours", desc: "The 'Island of Shaman' in Anda. Caves, red hematite paintings, boat coffins.", cost: "₱500/pax" },
  
  // CHILL/DINING
  { id: 'northzen', title: "North Zen Sunset", category: "Chill", audience: "Couples/Chill", mode: "Walk", travelTime: "15 min (Trike)", duration: "2 Hours", desc: "500m Bamboo boardwalk through mangroves. Best sunset spot on the island. Consumable entrance fee.", cost: "₱198/pax" },
  { id: 'cave', title: "Hinagdanan Cave", category: "Chill", audience: "Everyone", mode: "Self-Guided", travelTime: "15 min (Trike)", duration: "1 Hour", desc: "Limestone cave with a swimmable lagoon. Can get crowded.", cost: "₱50/pax" },
  { id: 'bee', title: "Bohol Bee Farm", category: "Chill", audience: "Dinner Group", mode: "Dining", travelTime: "20 min (Trike)", duration: "2 Hours", desc: "Organic food on a cliff. Great for sunset dinner. Try the spicy flower salad.", cost: "₱$$" },
];

const WINGMAN_SECTIONS: WingmanSection[] = [
  {
    id: 'culture',
    title: 'Protocol & Gifts',
    icon: Gift,
    color: 'purple',
    content: (
      <div className="space-y-6">
        <div className="bg-[#2CB6C0]/10 p-5 rounded-xl border border-[#2CB6C0]/20">
          <h4 className="font-bold text-[var(--heading-color)] mb-3 flex items-center gap-2"><Gift size={18}/> The Peace Offerings (Pasalubong)</h4>
          <ul className="text-sm text-[var(--ink)] space-y-3">
            <li>• <strong>Titas:</strong> Bath & Body Works, Perfumes, Ferrero Rocher.</li>
            <li>• <strong>Titos:</strong> Duty Free Whisky, Baseball Caps.</li>
            <li className="pt-3 border-t border-[#2CB6C0]/20 mt-2 text-[var(--accent-primary)] font-medium">
              <strong>⚠️ Golden Rule:</strong> Don't let Brother pay for everything at dinner. Offer to bring dessert or pay for the first round.
            </li>
          </ul>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="font-bold text-[var(--heading-color)] text-lg mb-1">"Mano Po"</div>
            <div className="text-sm text-slate-500">Hand to forehead greeting for elders. Shows massive respect. Do this immediately upon entering a house.</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="font-bold text-[var(--heading-color)] text-lg mb-1">"Kain Tayo"</div>
            <div className="text-sm text-slate-500">"Let's eat". The universal greeting. Always accept at least a small bite or a drink, even if you're full.</div>
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
      { label: "Small Bills", desc: "Break 1000s at 7-Eleven. Drivers often can't change a 500." },
    ]
  },
  {
    title: "Digital Wallets",
    icon: Smartphone,
    color: "teal",
    points: [
      { label: "GCash is Essential", desc: "Download & Verify it. 90% of shops (even street vendors) accept it." },
      { label: "Loading Up", desc: "Cash in at 7-Eleven Cliqq kiosks or link to US Bank (Remitly)." }
    ]
  },
  {
    title: "What Things Cost",
    icon: Coins,
    color: "green",
    points: [
      { label: "Tricycle Ride", desc: "₱20-50 short hops. ₱300 chartered." },
      { label: "Scooter Rental", desc: "₱400-600/day. Passport usually required." },
      { label: "Meals", desc: "Street: ₱50. Casual: ₱300. Fancy: ₱1000+." },
    ]
  }
];

// --- HELPER FUNCTIONS ---

function getThemeClasses(color: string) {
  switch (color) {
    case 'blue': 
    case 'indigo':
      return { 
        text: 'text-[var(--heading-color)]', 
        bg: 'bg-[#0F3D57]/10', 
        border: 'border-l-[var(--heading-color)]', 
        dot: 'bg-[var(--heading-color)]',
        icon: 'text-[var(--heading-color)]'
      };
    case 'orange': 
    case 'red':
      return { 
        text: 'text-[var(--accent-primary)]', 
        bg: 'bg-[#F04A00]/10', 
        border: 'border-l-[var(--accent-primary)]', 
        dot: 'bg-[var(--accent-primary)]',
        icon: 'text-[var(--accent-primary)]'
      };
    case 'teal': 
    case 'green':
    case 'emerald':
      return { 
        text: 'text-[var(--accent-secondary)]', 
        bg: 'bg-[#2CB6C0]/10', 
        border: 'border-l-[var(--accent-secondary)]', 
        dot: 'bg-[var(--accent-secondary)]',
        icon: 'text-[var(--accent-secondary)]'
      };
    case 'purple': 
      return { 
        text: 'text-purple-700', 
        bg: 'bg-purple-100', 
        border: 'border-l-purple-500', 
        dot: 'bg-purple-400',
        icon: 'text-purple-600'
      };
    default: 
      return { 
        text: 'text-slate-600', 
        bg: 'bg-slate-100', 
        border: 'border-l-slate-400', 
        dot: 'bg-slate-400',
        icon: 'text-slate-500' 
      };
  }
}

const LEGEND_ITEMS = [
  { type: 'base', label: 'Base Camp', color: 'blue', icon: Anchor },
  { type: 'adventure', label: 'Guided Adventures', color: 'green', icon: Mountain },
  { type: 'solo', label: 'Solo Activities', color: 'purple', icon: User },
  { type: 'food', label: 'Food', color: 'orange', icon: Utensils },
];

// --- COMPONENTS ---

interface DetailActivityCardProps {
  activity: Activity;
}

function DetailActivityCard({ activity }: DetailActivityCardProps) {
  const isGroup = activity.category === 'Group';
  const isSolo = activity.category === 'Solo';
  
  return (
    <div className="bg-white p-5 rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow)] flex flex-col h-full hover:border-[var(--accent-secondary)] transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
           <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full inline-block ${
              isGroup ? 'bg-[#0F3D57]/10 text-[#0F3D57]' : 
              isSolo ? 'bg-purple-100 text-purple-700' : 
              'bg-[#2CB6C0]/10 text-[#2CB6C0]'
           }`}>
             {activity.category}
           </div>
           <h4 className="font-bold text-[var(--heading-color)] text-lg leading-tight">{activity.title}</h4>
        </div>
        {activity.cost && <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{activity.cost}</span>}
      </div>
      
      <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 flex-1">{activity.desc}</p>
      
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
           <span className="text-slate-400 flex items-center gap-1"><Users size={12}/> Who</span>
           <span className="font-bold text-[var(--heading-color)]">{activity.audience}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
           <span className="text-slate-400 flex items-center gap-1"><Car size={12}/> Travel</span>
           <span className="font-bold text-[var(--accent-primary)]">{activity.travelTime}</span>
        </div>
      </div>
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
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${alert ? 'bg-red-100 border-red-500' : 'bg-white border-[var(--accent-secondary)]'}`}></div>
      
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-[var(--heading-color)] text-sm">{from} <span className="text-slate-300">→</span> {to}</div>
          <div className="text-xs text-[var(--muted)] font-mono mt-0.5">{flight}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-[var(--accent-primary)]">{duration}</div>
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
  const [mapFilters, setMapFilters] = useState<string[]>(['base', 'adventure', 'solo', 'food']);

  const daysLeft = Math.ceil((new Date('2025-12-26').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const toggleMapFilter = (type: string) => {
    setMapFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  // Filter map locations
  const filteredLocations = MAP_LOCATIONS.filter(l => {
     const effectiveType = l.type === 'chill' ? 'solo' : l.type;
     if (l.type === 'chill' && mapFilters.includes('solo')) return true;
     return mapFilters.includes(effectiveType);
  });

  return (
    <div className="h-screen w-full font-sans flex overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* CSS VARIABLES INJECTION */}
      <style>{`
        :root {
          /* --- Core Brand Palette --- */
          --orange: #F04A00;   /* International Orange (signal) */
          --blue:   #0F3D57;   /* Pacific Deep Blue (authority) */
          --teal:   #2CB6C0;   /* Fog Teal (interaction) */
          --ink:    #0F172A;   /* Ink / Charcoal (body text) */
          --paper:  #F8FAFC;   /* Paper / Near-White (backgrounds) */

          /* --- Semantic Roles --- */
          --accent-primary: var(--orange);      /* emphasis, dividers, active states */
          --accent-secondary: var(--teal);      /* links, pills, secondary icons */
          --heading-color: var(--blue);         /* headings */
          --body-color: var(--ink);             /* main text */
          --surface-color: var(--paper);        /* page background */

          /* --- UI Foundations --- */
          --bg: var(--surface-color);
          --card-bg: #ffffff;
          --text: var(--body-color);
          --muted: rgba(15, 23, 42, 0.72);
          --border: rgba(15, 23, 42, 0.10);
          --shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          --radius: 18px;
          --max-width: 1060px;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* SIDEBAR (Desktop Fixed) */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:bg-white md:border-r md:border-[var(--border)] z-50 shadow-sm flex-shrink-0 h-full overflow-y-auto">
        <div className="flex items-center gap-3 p-8 border-b border-[var(--border)]">
          <div className="bg-[var(--heading-color)] text-white p-2.5 rounded-xl shadow-lg shadow-blue-900/20"><Plane size={24} /></div>
          <div>
            <h1 className="font-bold text-xl text-[var(--heading-color)] tracking-tight">Bohol 2026</h1>
            <p className="text-xs font-medium text-[var(--accent-secondary)] uppercase tracking-wider">Brown Brothers Trip</p>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {['itinerary', 'activities', 'culture', 'map'].map((tab) => (
            <React.Fragment key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-[#F04A00]/10 text-[var(--accent-primary)] shadow-sm' 
                    : 'text-[var(--muted)] hover:bg-slate-50 hover:text-[var(--heading-color)]'
                }`}
              >
                {tab === 'itinerary' && <Plane size={20} />}
                {tab === 'activities' && <Calendar size={20} />}
                {tab === 'culture' && <Gift size={20} />}
                {tab === 'map' && <MapIcon size={20} />}
                <span className="capitalize">{tab === 'culture' ? 'Culture & Money' : tab}</span>
                {activeTab === tab && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]"></div>}
              </button>

              {/* Sidebar Sub-Menu Filters (Desktop Only) */}
              {tab === 'map' && activeTab === 'map' && (
                <div className="pl-12 pr-4 space-y-2 mt-1 animate-in slide-in-from-left-2 duration-300">
                   {LEGEND_ITEMS.map(item => {
                      const isActive = mapFilters.includes(item.type);
                      const theme = getThemeClasses(item.color);
                      return (
                        <button 
                            key={item.type}
                            onClick={() => toggleMapFilter(item.type)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 border ${
                              isActive 
                                ? `${theme.bg} ${theme.text} ${theme.border} border-opacity-50` 
                                : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                            }`}
                        >
                            <item.icon size={12} />
                            {item.label}
                        </button>
                      );
                   })}
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>
        <div className="p-6">
          <div className="bg-[var(--heading-color)] rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-[#2CB6C0] rounded-full blur-2xl opacity-30"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold mb-1">{daysLeft}</div>
              <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Days Until Departure</div>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-white/80 backdrop-blur-md p-4 border-b border-[var(--border)] z-30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--heading-color)] text-white p-2 rounded-lg"><Plane size={18} /></div>
            <div>
              <div className="font-bold text-[var(--heading-color)]">Bohol 2026</div>
            </div>
          </div>
          <div className="bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-orange-500/20">
            {daysLeft} Days
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className={`flex-1 relative ${activeTab === 'map' ? 'overflow-hidden' : 'overflow-y-auto p-4 md:p-10'}`}>
           <div className={`${activeTab === 'map' ? 'h-full w-full' : 'max-w-[var(--max-width)] mx-auto w-full pb-24 md:pb-10'}`}>
          
          {/* ITINERARY VIEW */}
          {activeTab === 'itinerary' && (
            <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2">
              <header className="mb-6">
                <h2 className="text-3xl font-bold text-[var(--heading-color)] tracking-tight">Logistics & Travel</h2>
                <p className="text-[var(--muted)] mt-1">Flights, Check-ins, and Movement.</p>
              </header>

              {/* CHECKLIST */}
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-[var(--radius)]">
                <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-4 text-lg"><CheckSquare size={20}/> Pre-Flight Checklist</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 bg-white/50 p-2 rounded-lg">
                        <input type="checkbox" className="mt-1 w-4 h-4 accent-[var(--accent-primary)]" />
                        <span className="text-sm text-amber-900/80"><strong>eTravel Registration:</strong> Mandatory for Philippines entry. Register at <a href="https://etravel.gov.ph" target="_blank" className="underline decoration-[var(--accent-primary)] font-bold text-amber-900">etravel.gov.ph</a> within 72h of flight.</span>
                    </div>
                    <div className="flex items-start gap-3 bg-white/50 p-2 rounded-lg">
                        <input type="checkbox" className="mt-1 w-4 h-4 accent-[var(--accent-primary)]" />
                        <span className="text-sm text-amber-900/80"><strong>Download Grab App:</strong> Link your credit card before leaving US.</span>
                    </div>
                    <div className="flex items-start gap-3 bg-white/50 p-2 rounded-lg">
                        <input type="checkbox" className="mt-1 w-4 h-4 accent-[var(--accent-primary)]" />
                        <span className="text-sm text-amber-900/80"><strong>Pasalubong Packed?</strong> Chocolates for kids, Whisky/Perfume for adults.</span>
                    </div>
                </div>
              </div>

              {/* FLIGHT CARDS */}
              <div className="grid gap-6 lg:grid-cols-2">
                 {/* OUTBOUND CARD */}
                 <div className="bg-white p-6 rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow)]">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <h3 className="font-bold text-[var(--heading-color)] flex items-center gap-2 text-lg"><Plane size={20} className="text-[var(--accent-secondary)]"/> Outbound</h3>
                      <span className="text-xs font-bold font-mono bg-[#2CB6C0]/10 text-[var(--accent-secondary)] px-2.5 py-1 rounded">Dec 26-28</span>
                    </div>
                    <div className="space-y-2">
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
                 <div className="bg-white p-6 rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow)]">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <h3 className="font-bold text-[var(--heading-color)] flex items-center gap-2 text-lg"><Plane size={20} className="text-[var(--accent-primary)]"/> Return</h3>
                      <span className="text-xs font-bold font-mono bg-[#F04A00]/10 text-[var(--accent-primary)] px-2.5 py-1 rounded">Jan 6</span>
                    </div>
                    <div className="space-y-2">
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

          {/* ACTIVITIES VIEW */}
          {activeTab === 'activities' && (
            <div className="space-y-10 animate-in fade-in duration-500 slide-in-from-bottom-2">
               <header className="mb-6">
                <h2 className="text-3xl font-bold text-[var(--heading-color)] tracking-tight">Mission Catalog</h2>
                <p className="text-[var(--muted)] mt-1">Classified adventures and recovery protocols.</p>
              </header>

              {/* SECTION: GROUP */}
              <section>
                 <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--heading-color)] mb-4 border-b border-slate-200 pb-2">
                    <Users className="text-[var(--accent-secondary)]" size={24}/> The Big Group Hits
                 </h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ACTIVITY_BANK.filter(a => a.category === 'Group').map(activity => (
                       <DetailActivityCard key={activity.id} activity={activity} />
                    ))}
                 </div>
              </section>

              {/* SECTION: SOLO */}
              <section>
                 <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--heading-color)] mb-4 border-b border-slate-200 pb-2">
                    <User className="text-purple-600" size={24}/> Solo Side Quests
                 </h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ACTIVITY_BANK.filter(a => a.category === 'Solo').map(activity => (
                       <DetailActivityCard key={activity.id} activity={activity} />
                    ))}
                 </div>
              </section>

              {/* SECTION: CHILL */}
              <section>
                 <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--heading-color)] mb-4 border-b border-slate-200 pb-2">
                    <Coffee className="text-[var(--accent-primary)]" size={24}/> Chill & Dining
                 </h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ACTIVITY_BANK.filter(a => a.category === 'Chill').map(activity => (
                       <DetailActivityCard key={activity.id} activity={activity} />
                    ))}
                 </div>
              </section>
            </div>
          )}

          {/* CULTURE & MONEY VIEW */}
          {activeTab === 'culture' && (
            <div className="space-y-10 animate-in fade-in duration-500 slide-in-from-bottom-2">
              <header className="mb-6">
                <h2 className="text-3xl font-bold text-[var(--heading-color)]">Culture & Local Intel</h2>
                <p className="text-[var(--muted)] mt-1">Protocols, Currency, and Survival Guides.</p>
              </header>

              {/* GIFTS & PROTOCOL */}
              <section>
                 <h3 className="font-bold text-xl text-[var(--heading-color)] mb-4 flex items-center gap-2">
                    <Gift size={20} className="text-purple-600"/> Protocol & Gifts
                 </h3>
                 {WINGMAN_SECTIONS.filter(s => s.id === 'culture').map((section, idx) => (
                    <div key={idx}>{section.content}</div>
                 ))}
              </section>
              
              <div className="h-px bg-slate-200 w-full"></div>

              {/* MONEY INTEL */}
              <section>
                 <h3 className="font-bold text-xl text-[var(--heading-color)] mb-4 flex items-center gap-2">
                    <Wallet size={20} className="text-[var(--accent-secondary)]"/> Financial Intel
                 </h3>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {MONEY_INTEL.map((section, idx) => {
                      const theme = getThemeClasses(section.color);
                      return (
                        <div key={idx} className={`bg-white p-5 rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow)] border-l-[4px] ${theme.border} flex flex-col`}>
                          <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${theme.text}`}>
                            <section.icon size={18} />
                            {section.title}
                          </h3>
                          <ul className="space-y-4 flex-1">
                            {section.points.map((point, pIdx) => (
                              <li key={pIdx} className="flex gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} mt-2 shrink-0 shadow-sm`}></div>
                                <div>
                                  <span className="font-bold text-[var(--heading-color)] block text-sm mb-0.5">{point.label}</span>
                                  <span className="text-xs text-[var(--muted)] leading-relaxed">{point.desc}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
              </section>
            </div>
          )}
          
          {/* CUSTOM REAL MAP VIEW (REVERTED TO GOOGLE MAP + CAROUSEL) */}
          {activeTab === 'map' && (
            <div className="w-full h-full relative group">
              
              {/* FILTER OVERLAY (MOBILE ONLY - floating top) */}
              <div className="md:hidden absolute top-4 left-4 right-4 z-20 flex flex-wrap gap-2 justify-center pointer-events-none">
                 {LEGEND_ITEMS.map(item => {
                    const isActive = mapFilters.includes(item.type);
                    const theme = getThemeClasses(item.color);
                    return (
                      <button 
                          key={item.type}
                          onClick={() => toggleMapFilter(item.type)}
                          className={`pointer-events-auto px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 border shadow-md backdrop-blur-md ${
                            isActive 
                              ? `${theme.bg} ${theme.text} ${theme.border} border-opacity-50 ring-1 ring-white/50` 
                              : 'bg-white/90 text-slate-400 border-slate-200 hover:bg-white'
                          }`}
                      >
                          <item.icon size={14} />
                          {item.label}
                      </button>
                    );
                 })}
              </div>

              {/* LOCATIONS CAROUSEL (BOTTOM) */}
              <div className="absolute bottom-20 md:bottom-8 left-0 right-0 z-20 overflow-x-auto p-4 no-scrollbar pointer-events-none">
                <div className="flex gap-4 w-max mx-auto md:mx-0 pointer-events-auto">
                  {filteredLocations.map((loc) => {
                    const isActive = mapLocation.id === loc.id;
                    const theme = getThemeClasses(
                       loc.type === 'base' ? 'blue' : 
                       loc.type === 'adventure' ? 'green' : 
                       loc.type === 'food' ? 'orange' : 'purple'
                    );
                    
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setMapLocation(loc)}
                        className={`flex flex-col items-start p-4 rounded-xl border w-[220px] transition-all duration-300 text-left bg-white/95 backdrop-blur shadow-xl ${
                          isActive
                            ? `border-[var(--accent-secondary)] ring-2 ring-[var(--accent-secondary)] ring-offset-2 scale-105` 
                            : `border-slate-200 hover:border-slate-300 hover:-translate-y-1`
                        }`}
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 px-2 py-0.5 rounded ${theme.bg} ${theme.text}`}>
                          {loc.type === 'chill' ? 'Solo' : loc.type}
                        </span>
                        <h4 className="font-bold text-[var(--heading-color)] text-sm leading-tight mb-1">{loc.name}</h4>
                        <p className="text-xs text-[var(--muted)] line-clamp-2">{loc.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* GOOGLE MAPS EMBED (BACKGROUND) */}
              <iframe 
                key={mapLocation.id} 
                src={`https://maps.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}&z=15&output=embed`}
                width="100%" 
                height="100%" 
                style={{border:0, display: 'block'}} 
                allowFullScreen={true} 
                loading="lazy" 
                title="Bohol Map"
                className="w-full h-full grayscale-[10%]"
               ></iframe>
            </div>
          )}
          </div>
        </main>

        {/* MOBILE NAV BOTTOM */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[var(--border)] flex justify-around p-2 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {['itinerary', 'activities', 'culture', 'map'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                activeTab === tab ? 'text-[var(--accent-primary)] scale-110 -translate-y-1' : 'text-slate-400'
              }`}
            >
              {tab === 'itinerary' && <Plane size={20} className={activeTab === tab ? "fill-current" : ""} />}
              {tab === 'activities' && <Calendar size={20} className={activeTab === tab ? "fill-current" : ""} />}
              {tab === 'culture' && <Gift size={20} className={activeTab === tab ? "fill-current" : ""} />}
              {tab === 'map' && <MapIcon size={20} className={activeTab === tab ? "fill-current" : ""} />}
              <span className="text-[9px] font-bold mt-1 capitalize tracking-tight">{tab === 'culture' ? 'Intel' : tab}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}