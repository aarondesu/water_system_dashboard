import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// export default [
//   layout("routes/subscriber/layout.tsx", [
//     index("routes/subscriber/index.tsx"),
//   ]),
//   route("invoice/:id", "routes/invoice/view.tsx"),
//   ...prefix("dashboard", [
//     layout("routes/dashboard/layout.tsx", [
//       index("routes/dashboard/index.tsx"),

//       // Users
//       ...prefix("user", [
//         index("routes/dashboard/user/view.tsx"),
//         route("create", "routes/dashboard/user/create.tsx"),
//       ]),

//       // Readings
//       ...prefix("reading", [
//         index("routes/dashboard/reading/view.tsx"),
//         route("create", "routes/dashboard/reading/create.tsx"),
//         route(
//           "create/multiple",
//           "routes/dashboard/reading/create-multiple.tsx"
//         ),
//       ]),

//       // Subscribers
//       ...prefix("subscriber", [
//         index("routes/dashboard/subscriber/index.tsx"),
//         route("create", "routes/dashboard/subscriber/create.tsx"),
//         route("edit/:id", "routes/dashboard/subscriber/edit.tsx"),
//         route("view/:id", "routes/dashboard/subscriber/view.tsx"),
//       ]),

//       // Meters
//       ...prefix("meter", [
//         index("routes/dashboard/meter/view.tsx"),
//         route("create", "routes/dashboard/meter/create.tsx"),
//         route("edit/:id", "routes/dashboard/meter/edit.tsx"),
//       ]),

//       // Invoices
//       ...prefix("invoice", [
//         index("routes/dashboard/invoice/view.tsx"),
//         route("create", "routes/dashboard/invoice/create.tsx"),
//         route(
//           "create/multiple",
//           "routes/dashboard/invoice/create-multiple.tsx"
//         ),
//         route("generate/:from/:to", "routes/dashboard/invoice/generate.tsx"),
//       ]),
//     ]),
//     route("/login", "routes/dashboard/login.tsx"),
//   ]),
// ] satisfies RouteConfig;

export default flatRoutes({}) satisfies RouteConfig;
