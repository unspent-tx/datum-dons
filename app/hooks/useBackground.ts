import { useAtom } from "jotai";
import { backgroundVisibleAtom } from "../store/atoms";

export function useBackground() {
  const [showBackground, setShowBackground] = useAtom(backgroundVisibleAtom);

  const toggleBackground = () => {
    setShowBackground(!showBackground);
  };

  const hideBackground = () => {
    setShowBackground(false);
  };

  const showBackgroundFn = () => {
    setShowBackground(true);
  };

  return {
    showBackground,
    setShowBackground,
    toggleBackground,
    hideBackground,
    showBackgroundFn,
  };
}
