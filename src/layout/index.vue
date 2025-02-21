<template>
	<div class="app-wrapper">
		<app-header></app-header>
		<div class="main-container">
			<app-main />
		</div>
		<div class="fixed-header">
			<navbar />
		</div>
	</div>
</template>

<script>
import {Navbar,AppMain} from './components'
import AppHeader from '@/components/AppHeader'

export default {
	name: 'Layout',
	components: {
		Navbar,
		AppMain,
		AppHeader,
	},
	data () {
		return {
			
		}
	},
	methods: {
	
	}
}
</script>
<style scoped>

</style>