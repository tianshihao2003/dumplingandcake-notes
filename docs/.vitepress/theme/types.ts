import type { Note } from "./data/notes";

export interface TreeNode {
	name: string;
	path: string;
	dirs: TreeNode[];
	notes: Note[];
}
