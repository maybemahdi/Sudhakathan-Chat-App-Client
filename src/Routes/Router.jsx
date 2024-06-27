import { createBrowserRouter } from "react-router-dom";
import Main from "../Pages/Main";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
  },
]);
