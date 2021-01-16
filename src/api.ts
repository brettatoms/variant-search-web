export const baseUrl = process.env.REACT_APP_INVARIANT_SEARCH_API_URL as string;

export const list = async (q?: string): Promise<string[]> => {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }

  const queryParams = "?".concat(params.toString());
  const url = [baseUrl, "genes"].join("/").concat(queryParams);
  const resp = await fetch(url);
  return await resp.json();
};

// interface GeneDetails {
//   columns: string[];
//   data: string[][];
// }
//
export type GeneDetail = Record<string, string>;

export const details = async (id: string): Promise<GeneDetail[]> => {
  const url = [baseUrl, "genes", id].join("/");
  const resp = await fetch(url);

  const details = await resp.json();
  return details.data.map((row: string[]) => {
    const pairs = row.map((value: string, i: number) => [
      details.columns[i],
      value,
    ]);
    return Object.fromEntries(pairs);
  });
};
