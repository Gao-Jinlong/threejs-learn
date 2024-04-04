import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<p>Initial Load...</p>}
    ></RouterProvider>
  );
}

export default App;
