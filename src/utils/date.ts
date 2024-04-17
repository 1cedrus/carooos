import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timeZone from 'dayjs/plugin/timezone';
import UTC from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(UTC);
dayjs.extend(timeZone);

export const fromNow = (timestamp: number) => {
  return dayjs(timestamp).fromNow();
};
