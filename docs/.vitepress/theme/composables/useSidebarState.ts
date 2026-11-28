import { ref } from "vue";

const OPEN_KEY = "kb:sidebar-open";
const EXPANDED_KEY = "kb:expanded-dirs";

const open = ref(true);
const mobileOpen = ref(false);
const expanded = ref<Set<string>>(new Set());
let loaded = false;

function load() {
	if (loaded || typeof window === "undefined") return;
	loaded = true;
	try {
		const savedOpen = localStorage.getItem(OPEN_KEY);
		if (savedOpen !== null) open.value = savedOpen === "1";
		const savedExpanded = localStorage.getItem(EXPANDED_KEY);
		if (savedExpanded) expanded.value = new Set(JSON.parse(savedExpanded));
	} catch {
		// localStorage 不可用时用默认值
	}
}

function persist() {
	try {
		localStorage.setItem(OPEN_KEY, open.value ? "1" : "0");
		localStorage.setItem(EXPANDED_KEY, JSON.stringify([...expanded.value]));
	} catch {
		// 忽略隐私模式下的写入失败
	}
}

export function useSidebarState() {
	load();

	function toggleSidebar() {
		open.value = !open.value;
		persist();
	}

	function toggleMobile() {
		mobileOpen.value = !mobileOpen.value;
	}

	function closeMobile() {
		mobileOpen.value = false;
	}

	function isExpanded(path: string) {
		return expanded.value.has(path);
	}

	function toggleDir(path: string) {
		const next = new Set(expanded.value);
		if (next.has(path)) next.delete(path);
		else next.add(path);
		expanded.value = next;
		persist();
	}

	function expandDirs(paths: string[]) {
		let changed = false;
		const next = new Set(expanded.value);
		for (const path of paths) {
			if (!next.has(path)) {
				next.add(path);
				changed = true;
			}
		}
		if (changed) {
			expanded.value = next;
			persist();
		}
	}

	return {
		open,
		mobileOpen,
		expanded,
		toggleSidebar,
		toggleMobile,
		closeMobile,
		isExpanded,
		toggleDir,
		expandDirs,
	};
}
