import Layout from "./Layout";
import { createBrowserRouter, NonIndexRouteObject } from "react-router-dom";

export interface MetaRouterObject extends NonIndexRouteObject {
  meta?: {
    title: string;
  };
  children?: MetaRouterObject[];
}

const router: MetaRouterObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <p>Not Found</p>,
    meta: {
      title: "Hello Three",
    },
    children: [
      {
        path: "",
        meta: {
          title: "Rotation Cube",
        },
        async lazy() {
          const component = await import("./RotationCube");
          return {
            Component: component.default,
          };
        },
      },
      {
        path: "/textView",
        meta: {
          title: "Text View",
        },
        async lazy() {
          const component = await import("./TextView");
          return {
            Component: component.default,
          };
        },
      },
    ],
  },
];

// TODO: 路由鉴权实现
// export function BeforeRouterHOC(props: MetaRouterObject) {
//   const { meta, ...rest } = props;

//   const resultRoute: RouteObject = {
//     ...rest,
//   };

//   document.title = meta?.title ?? "Hello Three";

//   const auth = localStorage.getItem("auth");

//   if (props.children) {
//     resultRoute.children = props.children.map((child) => {
//       return BeforeRouterHOC(child);
//     });
//   }

//   if (auth) {
//     return resultRoute;
//   } else {
//     resultRoute.element = <p>Not Auth</p>;
//     return resultRoute;
//   }
// }

const routes = createBrowserRouter(router);
export default routes;
