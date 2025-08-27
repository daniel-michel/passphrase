export function keepWhere<T, U extends T>(
	array: T[],
	predicate: (item: T, index: number, array: T[]) => item is U,
): asserts array is U[];
export function keepWhere<T>(
	array: T[],
	predicate: (item: T, index: number, array: T[]) => boolean,
): void;
export function keepWhere<T>(
	array: T[],
	predicate: (item: T, index: number, array: T[]) => boolean,
): void {
	for (let i = array.length - 1; i >= 0; i--) {
		if (!predicate(array[i], i, array)) {
			array.splice(i, 1);
		}
	}
}
