<!--
*- DECISIÓN DE DISEÑO: Este contenedor orquesta el dashboard modularizado y gestiona el estado mínimo necesario.
-->
<script lang="ts">
	import NavigationSidebar from './dashboard/NavigationSidebar.svelte';
	import DashboardHeader from './dashboard/DashboardHeader.svelte';
	import DashboardMainView from './dashboard/views/DashboardMainView.svelte';
	import ProjectsView from './dashboard/views/ProjectsView.svelte';
	import ProfileView from './dashboard/views/ProfileView.svelte';
	import SettingsView from './dashboard/views/SettingsView.svelte';
	import PlaceholderView from './dashboard/views/PlaceholderView.svelte';
	import {
		ayudaTypes,
		chatItems,
		filterLabels,
		luzParaAprenderProgress,
		metrics,
		navItems,
		projectItems
	} from './dashboard/data';
	import { computeQuickActions } from './dashboard/helpers';
	import type { ProjectItem, ViewMode } from './dashboard/types';
	import { GRADIENT_BG, PRIMARY_500, RING_AZURE_25, TEXT_100 } from './dashboard/tokens';

	const unreadChats = chatItems.filter((chat) => chat.isUnread).length;

	let viewMode: ViewMode = 'dashboard';
	let isMobileMenuOpen = false;
	let selectedProject: ProjectItem = projectItems[0];
	let sidebarWidth = 260;

	$: quickActions = computeQuickActions(viewMode, projectItems.length, unreadChats);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function handleViewChange(event: CustomEvent<ViewMode>) {
		viewMode = event.detail;
		if (isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	function handleSelectProject(event: CustomEvent<number>) {
		const project = projectItems.find((item) => item.id === event.detail);
		if (project) {
			selectedProject = project;
		}
	}
</script>

<div
	class="text-inter relative min-h-screen w-full font-sans antialiased"
	style={`background: ${GRADIENT_BG}; color: ${TEXT_100}; --sidebar-width: ${sidebarWidth}px;`}
>
	<NavigationSidebar
		{navItems}
		{viewMode}
		{quickActions}
		{chatItems}
		{projectItems}
		{isMobileMenuOpen}
		bind:sidebarWidth
		on:changeView={handleViewChange}
		on:selectProject={handleSelectProject}
	/>

	{#if isMobileMenuOpen}
		<div
			class="fixed inset-0 z-40 bg-black/60 lg:hidden"
			on:click={toggleMobileMenu}
			role="presentation"
		></div>
	{/if}

	<main class="dashboard-main ml-0 p-4 transition-all duration-300 ease-out lg:p-8" style="min-height: 100vh;">
		<button
			on:click={toggleMobileMenu}
			class="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-[18px] p-3 shadow-xl transition-all duration-300 hover:scale-[1.05] focus:outline-none focus:ring-4 active:scale-[0.98] lg:hidden"
			style="background: {PRIMARY_500}; box-shadow: 0 5px 20px {PRIMARY_500}80; color: white; --tw-ring-color: {RING_AZURE_25};"
			title="Menú principal"
			type="button"
			aria-label="Abrir menú principal"
		>
			<span class="sr-only">Abrir menú</span>
			☰
		</button>

		<section class="mx-auto max-w-[1280px] pt-10 lg:pt-6">
			<DashboardHeader {viewMode} />

			{#if viewMode === 'dashboard'}
				<DashboardMainView
					filters={filterLabels}
					{metrics}
					progressSegments={luzParaAprenderProgress}
					aidTypes={ayudaTypes}
					pendingRequests={3}
				/>
			{:else if viewMode === 'projects'}
				<ProjectsView project={selectedProject} />
			{:else if viewMode === 'profile'}
				<ProfileView />
			{:else if viewMode === 'settings'}
				<SettingsView />
			{:else}
				<PlaceholderView {viewMode} />
			{/if}
		</section>
	</main>
</div>

<style>
	.text-inter {
		font-family: 'Inter', sans-serif;
	}

	@media (min-width: 1024px) {
		.dashboard-main {
			margin-left: var(--sidebar-width, 260px);
		}
	}

	@media (max-width: 1023px) {
		.dashboard-main {
			margin-left: 0;
		}
	}
</style>
