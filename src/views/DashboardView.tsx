import LayoutMain from "../components/layout/LayoutMain";
import { JSX } from "react";

/**
 * @function DashboardView
 * @description The dashboard view
 * @returns {JSX.Element} JSX.Element
 */
function DashboardView(): JSX.Element {
  return (
    <LayoutMain slot={
      <h1 className="text-lg font-bold text-center flex items-center justify-center w-full h-full">
        No room selected
      </h1>
    } />
  )
}

export default DashboardView;
