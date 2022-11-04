<script lang="ts">
	import { adminSubAllAttendance, isAdmin } from '$lib/firebase';
	import { user, allAttendance, allUserData } from '$lib/stores';
	import moment from 'moment';
	import { onDestroy, onMount } from 'svelte';
	import { element } from 'svelte/internal';
	import { get } from 'svelte/store';

	let auth = false;

	let unsub: Function[] = [];

	let attendance = {} as { [key: string]: any };
	let userData = {} as { [key: string]: { name: string; pfp: string } };

	let scroll = 0;
	let spcH = 0;

	let daysRef: HTMLElement;

	$: {
		if (daysRef) {
			daysRef.scrollLeft = daysRef.scrollWidth - daysRef.clientWidth - scroll;
			spcH = daysRef.scrollWidth - daysRef.clientWidth + window.innerHeight;
		}
	}

	onMount(() => {
		unsub.push(
			user.subscribe(async () => {
				auth = await isAdmin();
			})
		);

		unsub.push(
			allAttendance.subscribe(async (val) => {
				attendance = formatAttendance(val);
			})
		);

		unsub.push(
			allUserData.subscribe(async (val) => {
				userData = val ?? {};
				attendance = formatAttendance(get(allAttendance));
			})
		);

		unsub.push(...adminSubAllAttendance());
	});

	onDestroy(() => {
		unsub.forEach((u) => u());
	});

	function formatAttendance(all: any) {
		if (!all) return {};

		let obj = {} as { [key: string]: any };

		Object.keys(all).forEach((user) => {
			Object.keys(all[user]).forEach((date) => {
				const num = parseInt(date);
				if (isNaN(num)) return;

				let midnight = moment(new Date(num)).startOf('day').format('x');

				if (!obj[midnight]) {
					obj[midnight] = [];
				}

				obj[midnight].push({
					user: userData[user],
					time: moment(new Date(num)).format('h:mm a')
				});
			});
		});

		return obj;
	}
</script>

<svelte:window bind:scrollY={scroll} />

{#if auth}
	<div class="header">
		<div class="heading" style:font-weight="bold">STAPLES CODING CLUB</div>
		&nbsp; &nbsp;
		<div class="mono">/ Attendance View</div>
	</div>

	<div class="days" bind:this={daysRef}>
		{#each Object.keys(attendance) as date}
			<div class="day">
				<div class="date heading">{moment(parseInt(date)).format('dddd, MMMM D, YYYY')}</div>
				{#each attendance[date] as entry}
					<div class="user">
						<img src={entry.user.pfp} alt="" />{entry.user.name}
						<span class="mono">({entry.time})</span>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="spacer" style:height="{spcH}px" />
{:else}
	<div class="heading" style:font-weight="bold">STAPLES CODING CLUB</div>
	<div class="mono">You are not authorized to view this page.</div>
{/if}

<style lang="scss">
	.header {
		font-size: 2.5rem;

		position: fixed;
		top: 0;
		right: 0;
		left: 0;

		display: flex;
		align-items: center;

		height: 5rem;
		padding: 0 1rem;

		border-bottom: 1px solid $color;

		.mono {
			font-size: 0.9em;
		}
	}

	.days {
		position: fixed;
		top: 5rem;

		overflow: hidden;

		width: 100%;
		height: 90%;

		white-space: nowrap;
	}

	.day {
		font-size: 1.5em;

		display: inline-flex;
		flex-direction: column;

		width: 35rem;
		height: 90%;
		margin: 1rem;
		padding: 1rem;

		border: 1px solid $color;
		border-radius: 1rem;

		.date {
			font-size: 1.4em;
			font-weight: bold;

			padding: 0.3rem 0.7rem;
		}

		.user {
			display: flex;
			align-items: center;

			padding: 0.5rem 1rem;

			&:nth-of-type(odd) {
				border-radius: 0.5rem;
				background: rgba($color, 0.1);
			}

			img {
				width: 1.5em;
				height: 1.5em;
				margin-right: 0.5em;
				padding: 0.5em 0;

				border-radius: 50%;
			}
		}
	}
</style>
