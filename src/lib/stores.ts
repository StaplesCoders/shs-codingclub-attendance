import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

export const user = writable<User | null>(null);
export const userAttendance = writable<Record<string, number> | null>(null);

export const allAttendance = writable<{ [key: string]: { [key: string]: string } } | null>(null);
export const allUserData = writable<{ [key: string]: { name: string; pfp: string } } | null>(null);
