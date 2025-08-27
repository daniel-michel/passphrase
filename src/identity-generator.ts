import { getCryptographicRandomNumber } from "./passphrase-generator.ts";
import { keepWhere } from "./utils/array.ts";

export type NameOptions = {
	firstNames:
		| string[]
		| {
				female: string[];
				male: string[];
		  };
	lastNames: string[];
	multipleFirstNames: boolean;
	asciiLetterOnlyNames: boolean;
	noSpacesInNames: boolean;
	autoCapitalize: boolean;
};
export function generateName(options: NameOptions) {
	const additionalNameCount = options.multipleFirstNames
		? valueToInfinity(Math.random(), 0.1)
		: 0;

	const firstNameList = Array.isArray(options.firstNames)
		? options.firstNames
		: options.firstNames[Math.random() < 0.5 ? "female" : "male"];
	const lastNameList = options.lastNames;
	if (options.asciiLetterOnlyNames) {
		keepWhere(firstNameList, (name) => /^[a-z\s]+$/i.test(name));
		keepWhere(lastNameList, (name) => /^[a-z\s]+$/i.test(name));
	}
	if (options.noSpacesInNames) {
		keepWhere(firstNameList, (name) => !name.includes(" "));
		keepWhere(lastNameList, (name) => !name.includes(" "));
	}

	let firstNames = Array.from({ length: 1 + additionalNameCount }, () =>
		selectRandom(firstNameList),
	);
	let lastName = selectRandom(lastNameList);
	if (options.autoCapitalize) {
		firstNames = firstNames.map(titleCase);
		lastName = titleCase(lastName);
	}
	return { firstNames, lastName };
}

export function capitalize(word: string) {
	if (word.length === 0) return word;
	return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function titleCase(phrase: string) {
	return phrase.replace(
		/(\p{L})([\p{L}\p{M}]*)/gu,
		(_, first, rest) => `${first.toUpperCase()}${rest.toLowerCase()}`,
	);
}

export function selectRandom<T>(array: T[]) {
	return array[getCryptographicRandomNumber(array.length)];
}

export function valueToInfinity(x: number, higherValueBias: number) {
	// return Math.floor(x / (((1 - higherValueBias) / higherValueBias) * (1 - x)));
	return Math.floor(Math.log(1 - x) / Math.log(higherValueBias));
}
