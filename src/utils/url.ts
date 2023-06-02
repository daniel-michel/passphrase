
export function createDataUrl(content: string, type: string) {
  return `data:${type};base64,${btoa(content)}`
}
