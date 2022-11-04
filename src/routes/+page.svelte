<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import moment from 'moment';

	import { user, userAttendance } from '$lib/stores';
	import { logAttendance, signIn as fbSignIn, signOut } from '$lib/firebase';
	import { isAttendanceLoggedToday } from '$lib/util';

	let date = moment().format('MMMM Do YYYY, h:mm a');

	// Unix time millis
	let unix = moment().format('x');

	let ready = false;

	let attnLogged = false;

	onMount(() => {
		ready = true;

		setInterval(() => {
			date = moment().format('MMMM Do YYYY, h:mm:ss a');
			unix = moment().format('x');
		}, 1);

		userAttendance.subscribe(() => {
			attnLogged = isAttendanceLoggedToday();
		});
	});

	async function signIn() {
		await fbSignIn();

		await logAttendance();
	}

	function loggedInLogAttn() {
		if (!attnLogged) {
			logAttendance();
		}
	}
</script>

{#if ready}
	<div class="wrapper">
		<div class="line" class:green={attnLogged} />
		{#if $user === null}
			<div
				class="content"
				on:click={signIn}
				on:keypress={signIn}
				in:fly={{ duration: 500, delay: 500, y: 100 }}
			>
				<div class="heading">CODING CLUB ATTENDANCE</div>
				<div class="mono time">{date} / {unix}</div>

				<div class="sign-in">Click to Sign In</div>
			</div>
		{:else}
			<div
				class="content"
				class:good={attnLogged}
				in:fly={{ duration: 500, delay: 500, y: 100 }}
				on:click={loggedInLogAttn}
				on:keypress={loggedInLogAttn}
			>
				<div class="heading">CODING CLUB ATTENDANCE</div>
				{#if attnLogged && $userAttendance}
					<div class="time mono">
						Attendance Logged <span style:font-weight="700"
							>{moment($userAttendance.last_write).format('MMMM Do YYYY, h:mm:ss a')}</span
						>
					</div>
					<div class="sign-in">You're all set, {$user.displayName?.split(' ')[0]}</div>
				{:else}
					<div class="mono time">{date} / {unix}</div>
					<div class="sign-in">
						{#if $user.photoURL !== ''}
							<img
								class="profile"
								referrerpolicy="“no-referrer”"
								src={$user.photoURL}
								alt="Profile"
							/>
						{/if}
						Click to Sign In as&nbsp;<span style:font-weight="bold">{$user.displayName}</span>
					</div>
				{/if}
			</div>
			<div
				class="button"
				class:good={attnLogged}
				on:click={signOut}
				on:keypress={signOut}
				in:fly={{ duration: 500, delay: 700, y: 100 }}
			>
				Not <span style:font-weight="bold">{$user.displayName}</span>?&nbsp;<span
					style:text-decoration="underline">Sign Out</span
				>
			</div>
		{/if}
		<div class="line line2" style:animation_delay={1000} class:green={attnLogged} />
	</div>
{/if}

<style lang="scss">
	.wrapper {
		overflow: hidden;

		width: 100%;
		height: 100%;
	}
	.line {
		//position: absolute;
		right: 50%;
		left: 50%;

		width: 1px;
		margin: 0 auto;
		//padding: 1em 0;

		transform: translateX(-50%);
		animation: drawline 0.5s ease-in-out forwards;

		background: $color;

		&.green {
			background: $green;
		}

		&.line2 {
			animation-delay: 1.1s;
		}
	}

	.content {
		font-size: 2.5em;

		position: relative;

		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;

		width: 90%;
		min-height: 25%;
		margin: 0 auto;

		cursor: pointer;
		transition: all 0.2s ease-in-out;

		border: 1px solid $color;

		&:not(.good)::after {
			position: absolute;
			top: 100%;
			right: 0;
			bottom: 0;
			left: 0;

			content: '';
			transition: top 0.5s ease-out;

			background: $color;

			mix-blend-mode: difference;
		}

		&.good {
			cursor: auto;

			color: $bkg;
			border: none;
			background: $green;
		}

		&:hover::after {
			top: 0;
		}

		.heading {
			font-weight: bold;
		}

		.time {
			font-size: 0.5em;
		}

		.sign-in {
			font-size: 0.45em;

			position: absolute;
			bottom: 0.5em;

			display: flex;
			align-items: center;

			img {
				width: 1.5em;
				height: 1.5em;
				margin-right: 0.5em;
				padding: 0.5em 0;

				border-radius: 50%;
			}
		}
	}

	.button {
		font-size: 1.5em;

		width: 15em;
		margin: 0.8em auto 0;
		padding: 0.5em 1em;

		cursor: pointer;
		transition: all 0.2s ease-in-out;
		text-align: center;

		border: 1px solid $color;

		&:hover {
			color: $bkg;
			background: $color;
		}

		&.good {
			color: $green;
			border-color: $green;

			&:hover {
				color: $bkg;
				background: $green;
			}
		}
	}

	@keyframes drawline {
		0% {
			height: 0;
		}
		100% {
			height: calc((100% - 25%) / 2);
		}
	}
</style>
