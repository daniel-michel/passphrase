export function generatePassphrase({
	words,
	count,
	separator,
	capitalize,
}: PassphraseGenerationOptions) {
	return getCryptographicRandomNumberSequence(words.length, count)
		.map((index) => words[index])
		.map((word) => (capitalize ? word[0].toUpperCase() + word.slice(1) : word))
		.join(separator);
}

export function generatePassword({
	length,
	characters,
}: PasswordGenerationOptions) {
	return getCryptographicRandomNumberSequence(characters.length, length)
		.map((number) => characters[number])
		.join("");
}

export function entropyForOptions(options: GenerationOptions) {
	if (isPassphraseOptions(options)) {
		if (options.words.length === 0) return 0;
		return Math.log2(options.words.length) * options.count;
	} else {
		if (options.characters.length === 0) return 0;
		return Math.log2(options.characters.length) * options.length;
	}
}

function getCryptographicRandomNumberSequence(limit: number, count: number) {
	return generateArray(count, () => getCryptographicRandomNumber(limit));
}

export function getCryptographicRandomNumber(limit: number) {
	const requiredBits = Math.ceil(Math.log2(limit));
	const requiredBytes = Math.ceil(requiredBits / 8);
	const array = new Uint8Array(requiredBytes);
	while (true) {
		crypto.getRandomValues(array);
		const randomValue =
			array.reduce(
				(accumulator, currentValue) => (accumulator << 8) + currentValue,
			) &
			((1 << requiredBits) - 1);
		if (randomValue < limit) {
			return randomValue;
		}
	}
}

export function isPassphraseOptions(
	options: GenerationOptions,
): options is PassphraseGenerationOptions {
	return "words" in options;
}

export type GenerationOptions =
	| PassphraseGenerationOptions
	| PasswordGenerationOptions;

export interface PassphraseGenerationOptions {
	words: string[];
	count: number;
	separator: string;
	capitalize: boolean;
}

export interface PasswordGenerationOptions {
	length: number;
	characters: string;
}

export function generateArray<T>(
	length: number,
	generator: (index: number) => T,
): T[] {
	return Array.from({ length: length }, (_, index) => generator(index));
}
