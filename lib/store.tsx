import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Car, cars, Conversation, initialConversations } from './data';

export const light = { bg: '#F6F7F2', surface: '#FFFFFF', text: '#1F2E25', muted: '#747F73', subtle: '#949D90', border: '#E4E8DD', soft: '#F0F3EA', green: '#D4F580', forest: '#213C30', tint: '#EDF4E1', hero: '#152A20' };
const dark = { bg: '#131C17', surface: '#1D2821', text: '#F2F4EE', muted: '#A4AEA3', subtle: '#8A968A', border: '#334237', soft: '#26342B', green: '#D4F580', forest: '#D4F580', tint: '#31442D', hero: '#172C23' };
export type Palette = typeof light;
type Store = {
  theme: Palette; darkMode: boolean; appearance: string; setAppearance: (v: string) => void;
  saved: string[]; toggleSaved: (id: string) => void; inventory: Car[]; ownCars: Car[];
  addCar: (car: Car) => void; updateCar: (car: Car) => void; removeCar: (id: string) => void;
  conversations: Conversation[]; sendMessage: (id: string, text: string) => void;
  startConversation: (car: Car, text?: string) => string; readConversation: (id: string) => void;
  location: string; setLocation: (v: string) => void; name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void; toast: string; notify: (text: string) => void; ready: boolean;
};
const Context = createContext<Store>(null as any);
export const useApp = () => useContext(Context);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [appearance, setAppearance] = useState('light');
  const darkMode = appearance === 'dark' || (appearance === 'system' && scheme === 'dark');
  const [saved, setSaved] = useState<string[]>(['porsche-panamera']);
  const [ownCars, setOwnCars] = useState<Car[]>([]);
  const [conversations, setConversations] = useState(initialConversations);
  const [location, setLocation] = useState('San Francisco, CA');
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [toast, setToast] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => { AsyncStorage.getItem('drivn-v1').then(value => { if (value) { const p = JSON.parse(value); setSaved(p.saved ?? []); setOwnCars(p.ownCars ?? []); setConversations(p.conversations ?? initialConversations); setLocation(p.location ?? 'San Francisco, CA'); setName(p.name ?? 'Alex Morgan'); setEmail(p.email ?? ''); setAppearance(p.appearance ?? 'light'); } }).catch(() => setToast('Your saved data could not be loaded. You can still explore.')).finally(() => setReady(true)); }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem('drivn-v1', JSON.stringify({ saved, ownCars, conversations, location, name, email, appearance })).catch(() => setToast('Device storage is full. Your changes may not be saved.')); }, [saved, ownCars, conversations, location, name, email, appearance, ready]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3600); return () => clearTimeout(timer); }, [toast]);
  const notify = (text: string) => { setToast(''); setTimeout(() => setToast(text), 10); };
  const toggleSaved = (id: string) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const sendMessage = (id: string, text: string) => setConversations(prev => prev.map(c => c.id === id ? { ...c, messages: [...c.messages, { id: Date.now().toString(), text, mine: true, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }] } : c));
  const startConversation = (car: Car, text?: string) => {
    const existing = conversations.find(c => c.carId === car.id);
    if (existing) { if (text) sendMessage(existing.id, text); return existing.id; }
    const id = 'thread-' + car.id;
    setConversations(prev => [{ id, carId: car.id, name: car.seller, initials: car.seller.split(' ').slice(0, 2).map(x => x[0]).join(''), unread: false, messages: text ? [{ id: Date.now().toString(), text, mine: true, time: 'Just now' }] : [] }, ...prev]);
    return id;
  };
  return <Context.Provider value={{ theme: darkMode ? dark : light, darkMode, appearance, setAppearance, saved, toggleSaved, ownCars, inventory: [...cars, ...ownCars], addCar: c => setOwnCars(p => [c, ...p]), updateCar: car => setOwnCars(p => p.map(existing => existing.id === car.id ? { ...car, own: true } : existing)), removeCar: id => { setOwnCars(p => p.filter(c => c.id !== id)); setSaved(p => p.filter(x => x !== id)); }, conversations, sendMessage, startConversation, readConversation: id => setConversations(p => p.map(c => c.id === id ? { ...c, unread: false } : c)), location, setLocation, name, setName, email, setEmail, toast, notify, ready }}>{children}</Context.Provider>;
}
