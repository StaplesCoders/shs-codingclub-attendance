<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import moment from 'moment';

	let date = moment().format('MMMM Do YYYY, h:mm a');

	// Unix time millis
	let unix = moment().format('x');

	let ready = false;
	onMount(() => {
		ready = true;

		setInterval(() => {
			date = moment().format('MMMM Do YYYY, h:mm:ss a');
			unix = moment().format('x');
		}, 1);
	});
</script>

{#if ready}
	<div class="wrapper">
		<div class="line" />
		<div class="content" in:fly={{ duration: 500, delay: 500, y: 100 }}>
			<div class="heading">CODING CLUB ATTENDANCE</div>
			<div class="mono time">{date} / Unix: {unix}</div>

			<div class="button sign-in">Sign In</div>
		</div>
		<div class="line line2" style:animation_delay={1000} />
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

    	&.line2 {
    		animation-delay: 1.1s;
    	}
    }

    .content {
    	font-size: 2em;

    	display: flex;
    	align-items: center;
    	flex-direction: column;
    	justify-content: center;

    	width: 90%;
    	min-height: 25%;
    	margin: 0 auto;

    	border: 1px solid $color;

    	.heading {
    		font-weight: bold;
    	}

    	.time {
    		font-size: 0.6em;
    	}

    	.button {
    		font-size: 0.8em;

    		margin: 0.8em 0 0;
    		padding: 0.5em 1em;

    		cursor: pointer;
    		transition: all 0.2s ease-in-out;

    		border: 1px solid $color;

    		&:hover {
    			color: $bkg;
    			background: $color;
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
