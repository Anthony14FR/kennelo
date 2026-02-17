import { ComponentType } from "react";

export type KIconProps = {
    filled?: boolean;
    size?: number;
    primary?: string;
    secondary?: string;
    secondaryOpacity?: number;
    className?: string;
};

export type KIcon = ComponentType<KIconProps>;

export { KCompass } from "./compass";
export { KHome } from "./home";
export { KMessage } from "./message";
export { KHeart } from "./heart";
export { ArrowLeftCircle } from "./arrow-left-circle";
export { KCalendar } from "./calendar";
