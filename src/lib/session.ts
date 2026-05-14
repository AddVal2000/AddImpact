export const getUserId = () =>
  typeof window === "undefined" ? null : localStorage.getItem("addval_user_id");

export const getCommunitySlug = () =>
  (typeof window === "undefined"
    ? null
    : (localStorage.getItem("addval_community_slug") as
        | "impala-rfc"
        | "soul-sisters"
        | null));

export const setSession = (userId: string, slug: string) => {
  localStorage.setItem("addval_user_id", userId);
  localStorage.setItem("addval_community_slug", slug);
};