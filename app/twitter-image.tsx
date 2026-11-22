import OpenGraphImage from "./opengraph-image";
import { COUPLE, DATE_LONG, VENUE } from "./lib/invite";

export const alt = `Ring Ceremony of ${COUPLE.bride} & ${COUPLE.groom} — ${DATE_LONG}, ${VENUE.name}, ${VENUE.locality}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpenGraphImage;
