import { get } from 'svelte/store';
import { userAttendance } from './stores';

export const isAttendanceLoggedToday = () => {
	const attn = get(userAttendance);

	const midnightMillis = new Date().setHours(0, 0, 0, 0).valueOf();
	const lastWrite = attn?.last_write ?? 0;

	return lastWrite > midnightMillis;
};
