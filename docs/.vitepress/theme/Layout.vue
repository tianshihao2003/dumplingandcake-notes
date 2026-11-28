<script setup lang="ts">
import { computed } from "vue";
import { Content, useData } from "vitepress";
import AppHeader from "./components/AppHeader.vue";
import SidebarTree from "./components/SidebarTree.vue";
import DocOutline from "./components/DocOutline.vue";
import DocMeta from "./components/DocMeta.vue";
import HomePage from "./components/HomePage.vue";
import ReadingProgress from "./components/ReadingProgress.vue";
import ImageLightbox from "./components/ImageLightbox.vue";
import CommentSection from "./components/CommentSection.vue";
import { useContentEnhance } from "./composables/useContentEnhance";

const { frontmatter, page } = useData();
useContentEnhance();

const isHome = computed(() => frontmatter.value.layout === "home");
const isNotFound = computed(() => page.value.isNotFound);
const isDoc = computed(() => !isHome.value && !isNotFound.value);
const headers = computed(() => page.value.headers ?? []);
const showOutline = computed(() => isDoc.value);

// 正文第一行就是同名 H1 时，隐藏它，避免和主题标题重复
const dropFirstH1 = computed(() => {
	const first = headers.value[0];
	return (
		!!first &&
		first.level === 1 &&
		first.title.trim() === (page.value.title ?? "").trim()
	);
});
</script>

<template>
	<div class="kb-app">
		<a class="kb-skip-link" href="#kb-main">跳到正文</a>
		<ReadingProgress v-if="isDoc" />
		<AppHeader />

		<div class="kb-shell">
			<SidebarTree />

			<div class="kb-main">
				<DocOutline v-if="showOutline" />

				<main id="kb-main" class="kb-content" :class="{ 'kb-content-home': isHome }">
					<HomePage v-if="isHome" />

					<div v-else-if="isNotFound" class="kb-404">
						<p class="kb-404-code">404</p>
						<h1>这一页不存在</h1>
						<p>可能已经被移动或删除。</p>
						<a class="kb-404-link" href="/">回到首页</a>
					</div>

					<article v-else class="kb-doc" data-pagefind-body>
						<header class="kb-doc-head">
							<h1 class="kb-doc-title">{{ page.title }}</h1>
							<DocMeta />
						</header>
						<div class="kb-doc-body" :class="{ 'kb-drop-first-h1': dropFirstH1 }">
							<Content />
						</div>
						<CommentSection />
					</article>
				</main>
			</div>
		</div>

		<ImageLightbox />
	</div>
</template>
