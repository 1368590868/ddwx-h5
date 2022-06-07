<template>
	<div id="app">
		<transition name="van-fade">
			<router-view />
		</transition>
	</div>
</template>
<script>
export default {
	
}
</script>
<style>
	body {
		font-size: 16px;
		background-color: #f8f8f8;
		-webkit-font-smoothing: antialiased;
		margin: 0;
		padding: 0;
	}
</style>