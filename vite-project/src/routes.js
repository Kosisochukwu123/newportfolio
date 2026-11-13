
import { route } from "@react-router/dev/routes";

export default [
  route("admin/*", "admin.jsx"),
  route("*?", "catchall.jsx"),
];
