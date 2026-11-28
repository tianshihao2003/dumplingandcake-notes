<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import Icon from "./Icon.vue";

const open = ref(false);
const src = ref("");
const alt = ref("");
const closeButton = ref<HTMLButtonElement | null>(null);

function onDocumentClick(event: MouseEvent) {
	const target = event.target as HTMLElement | null;
	if (!target) return;
	const img = target.closest<HTMLImageElement>(".kb-content img");
	if (!img || target.closest("a")) return;
	event.preventDefault();
	src.value = img.currentSrc || img.src;
	alt.value = img.alt || "";
	open.value = true;
	document.documentElement.classList.add("kb-no-scroll");
	nextTick(() => closeButton.value?.focus());
}

function close() {
	open.value = false;
	document.documentElement.classList.remove("kb-no-scroll");
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === "Escape" && open.value) close();
}

onMounted(() => {
	document.addEventListener("click", onDocumentClick);
	window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", onDocumentClick);
	window.removeEventListener("keydown", onKeydown);
	document.documentElement.classList.remove("kb-no-scroll");
});
</script>

<template>
	<Teleport to="body">
		<div v-if="open" class="kb-lightbox" role="dialog" aria-modal="true" :aria-label="alt || '图片预览'" @click.self="close">
			<button ref="closeButton" class="kb-lightbox-close" type="button" aria-label="关闭" @click="close">
				<Icon name="x" :size="20" />
			</button>
			<img :src="src" :alt="alt" @click="close" />
		</div>
	</Teleport>
</template>
