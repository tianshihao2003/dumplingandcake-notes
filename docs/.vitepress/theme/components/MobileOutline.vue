<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vitepress";
import Icon from "./Icon.vue";

interface Header {
	level: number;
	title: string;
	slug: string;
}

const route = useRoute();
const headers = ref<Header[]>([]);
const open = ref(false);

function scan() {
	if (typeof document === "undefined") return;
	const nodes = document.querySelectorAll<HTMLElement>(".kb-doc-body h2, .kb-doc-body h3");
	headers.value = [...nodes].map((node) => ({
		level: Number(node.tagName.slice(1)),
		title: node.textContent?.replace(/\u200b/g, "").trim() ?? "",
		slug: node.id,
	}));
}

function close() {
	open.value = false;
	document.documentElement.classList.remove("kb-no-scroll");
}

function show() {
	open.value = true;
	document.documentElement.classList.add("kb-no-scroll");
}

onMounted(() => {
	scan();
	watch(
		() => route.path,
		async () => {
			await nextTick();
			scan();
			close();
		},
		{ flush: "post" },
	);
});
</script>

<template>
	<template v-if="headers.length">
		<button
			class="kb-mobile-toc-btn"
			type="button"
			aria-label="打开本页目录"
			@click="show"
		>
			<Icon name="hash" :size="15" />
			<span>目录</span>
			<em>{{ headers.length }}</em>
		</button>

		<Teleport to="body">
			<div v-if="open" class="kb-mobile-toc-mask" @click.self="close">
				<div class="kb-mobile-toc-sheet" role="dialog" aria-modal="true" aria-label="本页目录">
					<div class="kb-mobile-toc-head">
						<strong><Icon name="hash" :size="15" />本页目录</strong>
						<button class="kb-icon-btn" type="button" aria-label="关闭目录" @click="close">
							<Icon name="x" />
						</button>
					</div>
					<nav>
						<ul>
							<li v-for="header in headers" :key="header.slug" :class="`level-${header.level}`">
								<a :href="`#${header.slug}`" @click="close">{{ header.title }}</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</Teleport>
	</template>
</template>
