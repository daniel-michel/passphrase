export async function loadList(path: string): Promise<string[]> {
	const response = await fetch(new URL(path, location.href));
	const text = await response.text();
	const item = text
		.split(/\r?\n|\r/g)
		.filter((v) => v)
		.map((line) => line.replace(/^\d+\s+/, ""));
	return item;
}
