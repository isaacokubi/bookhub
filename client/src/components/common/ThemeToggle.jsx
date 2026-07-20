import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, setDark } = useTheme();

  return (
    <button onClick={() => setDark(!dark)}>{dark ? "Light" : "Dark"}</button>
  );
}
