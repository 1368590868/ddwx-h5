<template>
	<div class="app-wrapper">
		<div class="main-container">
			<app-main />
		</div>
		<div class="fixed-header">
			<navbar />
		</div>
	</div>
</template>

<script>
	import {
		Navbar,
		// Sidebar,
		AppMain
	} from './components'
	// import ResizeMixin from './mixin/ResizeHandler'

	export default {
		name: 'Layout',
		// mixins: [ResizeMixin],
		components: {
			Navbar,
			// Sidebar,
			AppMain
		},

		methods: {
			handleClickOutside() {

			}
		}
	}
</script>

<style scoped>

</style>