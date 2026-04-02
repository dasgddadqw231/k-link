import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Campaign from "./pages/Campaign";
import B2B from "./pages/B2B";
import Creator from "./pages/Creator";
import Brands from "./pages/Brands";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "campaign/:id", Component: Campaign },
      { path: "b2b", Component: B2B },
      { path: "creator", Component: Creator },
      { path: "brands", Component: Brands },
    ],
  },
]);
