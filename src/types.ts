export interface Extension {
	value: string; // Add this to the Marketplace's definition
	title: string;
	description: string;
	icon: string;
	files: string[];
	enabled: boolean;
	uiComponents: any[]; // Extend to include UI components and actions
}

export interface File {
	name: string;
	content: string;
	type: "html" | "css" | "javascript"; // Narrowed down to specific types
}
