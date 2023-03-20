import { ApiService } from "./api";

export const SearchAndReplaceContent = async (
  search: string,
  replacement: string,
  token: string
) => {
  await ApiService.put("/content/management/replace", {
    token,
    replacement,
    text: search,
  });
};
