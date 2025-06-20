import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("dashboard", [
    layout("routes/dashboard/layout.tsx", [
      index("routes/dashboard/index.tsx"),

      // Users
      ...prefix("users", [
        index("routes/dashboard/users/view.tsx"),
        route("create", "routes/dashboard/users/create.tsx"),
      ]),

      // Readings
      ...prefix("readings", [
        index("routes/dashboard/readings/view.tsx"),
        route("create", "routes/dashboard/readings/create.tsx"),
      ]),

      // Subscribers
      ...prefix("subscribers", [
        index("routes/dashboard/subscribers/index.tsx"),
        route("create", "routes/dashboard/subscribers/create.tsx"),
        route("edit/:id", "routes/dashboard/subscribers/edit.tsx"),
        route("view/:id", "routes/dashboard/subscribers/view.tsx"),
      ]),

      // Meters
      ...prefix("meters", [
        index("routes/dashboard/meters/view.tsx"),
        route("create", "routes/dashboard/meters/create.tsx"),
        route("edit/:id", "routes/dashboard/meters/edit.tsx"),
      ]),

      // Invoices
      ...prefix("invoices", [
        index("routes/dashboard/invoices/view.tsx"),
        route("create", "routes/dashboard/invoices/create.tsx"),
      ]),
    ]),
    route("/login", "routes/dashboard/login.tsx"),
  ]),
] satisfies RouteConfig;
