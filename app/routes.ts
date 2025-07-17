import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("edit/:id?", "routes/editDoc.tsx"),
  route("profile/", "routes/settings.tsx"),
  route("auth/callback", "auth/callback/AuthCallback.tsx"),
] satisfies RouteConfig;
