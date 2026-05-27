import { getJakartaDate, getJakartaHour } from "~/utils/time";

export const scheduleHours = [0, 3, 6, 9, 12, 15, 18, 21];

export function isSaleLive() {
  const now = getJakartaDate();

  for (const hour of scheduleHours) {
    const saleTime = new Date(now);

    saleTime.setHours(hour, 0, 0, 0);

    if (hour === 0 && now.getHours() >= 23) {
      saleTime.setDate(saleTime.getDate() + 1);
    }

    const saleEnd = new Date(saleTime);

    saleEnd.setMinutes(30);

    if (now >= saleTime && now < saleEnd) {
      return true;
    }
  }

  return false;
}
