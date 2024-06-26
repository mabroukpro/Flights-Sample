export function searchParamsFromObject(
  data: Record<string, string | number | boolean | undefined> = {},
  addQuestionMark: boolean = true,
  keepDate: boolean = false
): string {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  let sp = params.toString();

  if (sp && addQuestionMark) {
    sp = "?" + sp;
  }

  return sp;
}
