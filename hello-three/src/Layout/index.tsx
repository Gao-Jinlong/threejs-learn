import { Outlet, useNavigate } from "react-router-dom";
import "./index.scss";

export default function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <NavbarItem name={"Home"} path={"/"} title={"Home"} />
        <NavbarItem
          name="TextView"
          path="/textView"
          title="TextView"
        ></NavbarItem>
      </div>

      <Outlet></Outlet>
    </div>
  );
}

function NavbarItem(props: { name: string; path: string; title: string }) {
  const { name, path, title = "THREE" } = props;
  const navigate = useNavigate();

  function onClick() {
    document.title = title;
    navigate(path);
  }

  return (
    <div className="navbar-item" onClick={onClick}>
      {name}
    </div>
  );
}
