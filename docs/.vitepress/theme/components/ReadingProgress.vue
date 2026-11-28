<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const progress = ref(0);
let ticking = false;

function update() {
	const doc = document.documentElement;
	const max = doc.scrollHeight - doc.clientHeight;
	progress.value = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
	ticking = false;
}

function onScroll() {
	if (ticking) return;
	ticking = true;
	requestAnimationFrame(update);
}

onMounted(() => {
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll);
	update();
});

onBeforeUnmount(() => {
	window.removeEventListener("scroll", onScroll);
	window.removeEventListener("resize", onScroll);
});
</script>

<template>
	<div class="kb-progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
</template>
