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
export { KArrowLeftCircle } from "./arrow-left-circle";
export { KCalendar } from "./calendar";
export { KKey2 } from "./key-2";
export { KLocked2 } from "./locked-2";
export { KEnvelope1 } from "./envelope-1";
