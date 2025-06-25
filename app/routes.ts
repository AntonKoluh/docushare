import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("docs", "routes/fileList.tsx"),
  route("edit/:id?", "routes/editDoc.tsx"),
] satisfies RouteConfig;
