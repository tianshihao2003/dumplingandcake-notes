<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useData, useRoute } from "vitepress";

const { page, theme } = useData();
const route = useRoute();
const el = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const enabled = computed(
	() =>
		page.value.frontmatter.comment !== false &&
		page.value.frontmatter.date !== false &&
		!!theme.value.comment?.serverURL,
);

onMounted(() => {
	if (!enabled.value || !el.value) return;
	observer = new IntersectionObserver(
		async (entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			observer?.disconnect();
			observer = null;
			const [{ init }] = await Promise.all([
				import("@waline/client"),
				import("@waline/client/style"),
			]);
			init({
				el: el.value!,
				serverURL: theme.value.comment.serverURL,
				path: route.path,
				dark: "html.dark",
				lang: "zh-CN",
				reaction: false,
			});
		},
		{ rootMargin: "400px 0px" },
	);
	observer.observe(el.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
	<section v-if="enabled" class="kb-comments" data-pagefind-ignore>
		<h2 class="kb-comments-title">评论</h2>
		<div ref="el" />
	</section>
</template>
