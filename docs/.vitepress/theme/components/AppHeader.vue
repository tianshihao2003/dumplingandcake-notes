<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useData, withBase } from "vitepress";
import Icon from "./Icon.vue";
import SearchModal from "./SearchModal.vue";
import { useSidebarState } from "../composables/useSidebarState";

const { site, theme, page, isDark } = useData();
const { open, toggleSidebar, toggleMobile, mobileOpen } = useSidebarState();
const searchOpen = ref(false);

const isHome = computed(() => page.value.frontmatter.layout === "home");

const crumbs = computed(() => {
	const rel = page.value.relativePath;
	if (!rel.startsWith("posts/")) return [];
	const parts = rel.replace(/^posts\//, "").replace(/\.md$/, "").split("/");
	const last = parts.pop() ?? "";
	const items = parts.map((name, index) => ({
		text: name,
		link: withBase(`/posts/${parts.slice(0, index + 1).map(encodeURIComponent).join("/")}/`),
	}));
	items.push({ text: page.value.title || last, link: "" });
	return items;
});

function toggleTheme() {
	isDark.value = !isDark.value;
	try {
		localStorage.setItem("vitepress-theme-appearance", isDark.value ? "dark" : "light");
	} catch {
		// 忽略隐私模式
	}
}

function onKeydown(event: KeyboardEvent) {
	if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
		event.preventDefault();
		searchOpen.value = true;
	}
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
	<header class="kb-header" data-pagefind-ignore>
		<div class="kb-header-left">
			<button
				class="kb-icon-btn kb-mobile-only"
				type="button"
				:aria-expanded="mobileOpen"
				aria-label="打开目录"
				@click="toggleMobile"
			>
				<Icon name="menu" />
			</button>
			<button
				class="kb-icon-btn kb-desktop-only"
				type="button"
				:aria-expanded="open"
				:aria-label="open ? '折叠目录栏' : '展开目录栏'"
				:title="open ? '折叠目录栏' : '展开目录栏'"
				@click="toggleSidebar"
			>
				<Icon name="panel-left" />
			</button>

			<a class="kb-brand" href="/" :aria-label="theme.siteTitle || site.title">
				<img class="kb-brand-logo" :src="withBase('/logo.webp')" alt="" width="26" height="26" />
				<span class="kb-brand-name">{{ theme.siteTitle || site.title }}</span>
			</a>

			<nav v-if="!isHome && crumbs.length" class="kb-breadcrumb" aria-label="面包屑">
				<a href="/" class="kb-breadcrumb-home" aria-label="首页"><Icon name="home" :size="14" /></a>
				<template v-for="(crumb, index) in crumbs" :key="crumb.text + index">
					<Icon name="chevron-right" :size="13" class="kb-breadcrumb-sep" />
					<a v-if="crumb.link" :href="crumb.link" class="kb-breadcrumb-link">{{ crumb.text }}</a>
					<span v-else class="kb-breadcrumb-current" aria-current="page">{{ crumb.text }}</span>
				</template>
			</nav>
		</div>

		<div class="kb-header-right">
			<button class="kb-search-trigger" type="button" aria-label="搜索笔记" @click="searchOpen = true">
				<Icon name="search" :size="15" />
				<span>搜索笔记</span>
				<kbd>Ctrl K</kbd>
			</button>
			<button class="kb-icon-btn" type="button" aria-label="切换主题" @click="toggleTheme">
				<Icon :name="isDark ? 'sun' : 'moon'" />
			</button>
			<a
				v-if="theme.github"
				class="kb-icon-btn"
				:href="theme.github"
				target="_blank"
				rel="noreferrer"
				aria-label="GitHub"
			>
				<Icon name="github" />
			</a>
		</div>
	</header>

	<SearchModal v-model:open="searchOpen" />
</template>
