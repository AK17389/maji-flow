// ============================================================
// Maji Flow - Application State Store
// Simulates Flask session/backend state in React
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'resident' | 'utility';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountNumber?: string;
  meterNumber?: string;
  balance?: number;  // water credits in ZMW
  zone?: string;
}

export interface KioskData {
  id: string;
  name: string;
  location: string;
  zone: string;
  status: 'online' | 'offline' | 'maintenance';
  flow_rate: number;       // L/min
  pressure: number;        // bar
  daily_volume: number;    // liters
  last_updated: string;
  lat: number;
  lng: number;
}

export interface NetworkStats {
  total_kiosks: number;
  active_kiosks: number;
  offline_kiosks: number;
  maintenance_kiosks: number;
  total_daily_volume: number;   // liters
  avg_pressure: number;         // bar
  avg_flow_rate: number;        // L/min
  water_quality_index: number;  // 0-100
  network_efficiency: number;   // %
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  location: string;
  timestamp: string;
  resolved: boolean;
}

export interface TopupRecord {
  id: string;
  amount: number;
  credits: number;
  timestamp: string;
  method: string;
  reference: string;
}

export interface ConsumptionRecord {
  date: string;
  volume: number;   // liters
  cost: number;     // ZMW
}

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  authError: string | null;

  // UI
  sidebarOpen: boolean;
  activeSection: string;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;

  // Data
  kiosks: KioskData[];
  networkStats: NetworkStats | null;
  topupHistory: TopupRecord[];
  consumptionHistory: ConsumptionRecord[];

  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => boolean;
  topup: (amount: number, method: string) => boolean;
  fetchKiosks: () => void;
  fetchNetworkStats: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  clearAuthError: () => void;
}

// ============================================================
// Demo users (simulates Flask hardcoded users)
// ============================================================
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'resident@majiflow.co.zm': {
    password: 'water123',
    user: {
      id: 'usr_001',
      name: 'Chanda Mwale',
      email: 'resident@majiflow.co.zm',
      role: 'resident',
      accountNumber: 'MF-2024-0042',
      meterNumber: 'MTR-LK-1198',
      balance: 125.50,
      zone: 'Lusaka East',
    },
  },
  'utility@lwsc.co.zm': {
    password: 'lwsc2026',
    user: {
      id: 'usr_002',
      name: 'Ngosa Banda',
      email: 'utility@lwsc.co.zm',
      role: 'utility',
      zone: 'All Zones',
    },
  },
};

// ============================================================
// Mock kiosk data (simulates /api/kiosks endpoint)
// ============================================================
const MOCK_KIOSKS: KioskData[] = [
  { id: 'K001', name: 'Kalingalinga Kiosk A', location: 'Kalingalinga Market', zone: 'Lusaka East', status: 'online', flow_rate: 12.4, pressure: 2.8, daily_volume: 14880, last_updated: '2 min ago', lat: -15.4166, lng: 28.3082 },
  { id: 'K002', name: 'Matero Main Kiosk', location: 'Matero Township', zone: 'Lusaka West', status: 'online', flow_rate: 9.8, pressure: 2.6, daily_volume: 11760, last_updated: '1 min ago', lat: -15.3833, lng: 28.2667 },
  { id: 'K003', name: 'Chawama Kiosk 1', location: 'Chawama Compound', zone: 'Lusaka South', status: 'maintenance', flow_rate: 0, pressure: 0, daily_volume: 0, last_updated: '3 hrs ago', lat: -15.4500, lng: 28.3167 },
  { id: 'K004', name: 'Kanyama North Kiosk', location: 'Kanyama Township', zone: 'Lusaka West', status: 'online', flow_rate: 11.2, pressure: 2.9, daily_volume: 13440, last_updated: '5 min ago', lat: -15.4000, lng: 28.2500 },
  { id: 'K005', name: 'Chelstone Kiosk', location: 'Chelstone Road', zone: 'Lusaka East', status: 'online', flow_rate: 8.6, pressure: 2.5, daily_volume: 10320, last_updated: '3 min ago', lat: -15.3700, lng: 28.3400 },
  { id: 'K006', name: 'Mtendere Kiosk B', location: 'Mtendere East', zone: 'Lusaka East', status: 'offline', flow_rate: 0, pressure: 0, daily_volume: 0, last_updated: '2 hrs ago', lat: -15.4300, lng: 28.3600 },
  { id: 'K007', name: 'Ng\'ombe Kiosk', location: 'Ng\'ombe Compound', zone: 'Lusaka North', status: 'online', flow_rate: 10.1, pressure: 2.7, daily_volume: 12120, last_updated: '1 min ago', lat: -15.3500, lng: 28.3100 },
  { id: 'K008', name: 'Misisi Kiosk', location: 'Misisi Compound', zone: 'Lusaka South', status: 'online', flow_rate: 7.9, pressure: 2.4, daily_volume: 9480, last_updated: '4 min ago', lat: -15.4700, lng: 28.3000 },
];

// ============================================================
// Mock network stats (simulates /api/network-stats endpoint)
// ============================================================
const MOCK_NETWORK_STATS: NetworkStats = {
  total_kiosks: 8,
  active_kiosks: 6,
  offline_kiosks: 1,
  maintenance_kiosks: 1,
  total_daily_volume: 72000,
  avg_pressure: 2.65,
  avg_flow_rate: 10.0,
  water_quality_index: 94,
  network_efficiency: 87.5,
  alerts: [
    { id: 'ALT001', type: 'warning', message: 'Low pressure detected', location: 'Chelstone Kiosk', timestamp: '14:32', resolved: false },
    { id: 'ALT002', type: 'error', message: 'Kiosk offline - no signal', location: 'Mtendere Kiosk B', timestamp: '12:15', resolved: false },
    { id: 'ALT003', type: 'warning', message: 'Scheduled maintenance in progress', location: 'Chawama Kiosk 1', timestamp: '09:00', resolved: false },
    { id: 'ALT004', type: 'info', message: 'Peak usage hours (06:00-08:00)', location: 'Kanyama North', timestamp: '08:00', resolved: true },
    { id: 'ALT005', type: 'info', message: 'Daily report generated', location: 'Network HQ', timestamp: '00:01', resolved: true },
  ],
};

// ============================================================
// Mock consumption history
// ============================================================
const MOCK_CONSUMPTION: ConsumptionRecord[] = [
  { date: 'Mon', volume: 120, cost: 12.00 },
  { date: 'Tue', volume: 95, cost: 9.50 },
  { date: 'Wed', volume: 140, cost: 14.00 },
  { date: 'Thu', volume: 110, cost: 11.00 },
  { date: 'Fri', volume: 160, cost: 16.00 },
  { date: 'Sat', volume: 200, cost: 20.00 },
  { date: 'Sun', volume: 180, cost: 18.00 },
];

// ============================================================
// Zustand store
// ============================================================
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      authError: null,
      sidebarOpen: true,
      activeSection: 'dashboard',
      toast: null,
      kiosks: [],
      networkStats: null,
      topupHistory: [],
      consumptionHistory: MOCK_CONSUMPTION,

      // ── AUTH ──────────────────────────────────────────────
      login: (email: string, password: string) => {
        const record = DEMO_USERS[email.toLowerCase()];
        if (record && record.password === password) {
          set({
            currentUser: record.user,
            isAuthenticated: true,
            authError: null,
            topupHistory: [],
          });
          return true;
        }
        set({ authError: 'Invalid email or password. Please try again.' });
        return false;
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          authError: null,
          kiosks: [],
          networkStats: null,
          topupHistory: [],
          activeSection: 'dashboard',
        });
      },

      register: (name: string, email: string, _password: string, role: UserRole) => {
        // Simulate registration - in real Flask app this saves to DB
        if (DEMO_USERS[email.toLowerCase()]) {
          set({ authError: 'An account with this email already exists.' });
          return false;
        }
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name,
          email,
          role,
          accountNumber: `MF-2024-${Math.floor(Math.random() * 9000 + 1000)}`,
          meterNumber: `MTR-LK-${Math.floor(Math.random() * 9000 + 1000)}`,
          balance: 0,
          zone: 'Lusaka Central',
        };
        set({
          currentUser: newUser,
          isAuthenticated: true,
          authError: null,
        });
        return true;
      },

      // ── API: /api/topup ───────────────────────────────────
      topup: (amount: number, method: string) => {
        const state = get();
        if (!state.currentUser) return false;

        const credits = amount;  // 1 ZMW = 1 credit
        const record: TopupRecord = {
          id: `TXN${Date.now()}`,
          amount,
          credits,
          timestamp: new Date().toLocaleString('en-ZM'),
          method,
          reference: `MF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        };

        const updatedUser = {
          ...state.currentUser,
          balance: (state.currentUser.balance || 0) + credits,
        };

        set({
          currentUser: updatedUser,
          topupHistory: [record, ...state.topupHistory],
        });
        return true;
      },

      // ── API: /api/kiosks ──────────────────────────────────
      fetchKiosks: () => {
        // Simulate API call with slight random variation
        const kiosks = MOCK_KIOSKS.map(k => ({
          ...k,
          flow_rate: k.status === 'online'
            ? parseFloat((k.flow_rate + (Math.random() - 0.5) * 0.5).toFixed(1))
            : 0,
          pressure: k.status === 'online'
            ? parseFloat((k.pressure + (Math.random() - 0.5) * 0.1).toFixed(2))
            : 0,
        }));
        set({ kiosks });
      },

      // ── API: /api/network-stats ───────────────────────────
      fetchNetworkStats: () => {
        const stats = {
          ...MOCK_NETWORK_STATS,
          total_daily_volume: MOCK_NETWORK_STATS.total_daily_volume + Math.floor(Math.random() * 1000),
          avg_pressure: parseFloat((MOCK_NETWORK_STATS.avg_pressure + (Math.random() - 0.5) * 0.05).toFixed(2)),
          avg_flow_rate: parseFloat((MOCK_NETWORK_STATS.avg_flow_rate + (Math.random() - 0.5) * 0.3).toFixed(1)),
        };
        set({ networkStats: stats });
      },

      // ── UI ────────────────────────────────────────────────
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveSection: (section) => set({ activeSection: section }),
      showToast: (message, type) => set({ toast: { message, type } }),
      clearToast: () => set({ toast: null }),
      clearAuthError: () => set({ authError: null }),
    }),
    {
      name: 'maji-flow-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        topupHistory: state.topupHistory,
      }),
    }
  )
);
