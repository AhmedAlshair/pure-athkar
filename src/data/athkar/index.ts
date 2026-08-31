import type { AthkarCategory } from './types';
import { morningAthkar } from './morning';
import { eveningAthkar } from './evening';
import { afterPrayerAthkar } from './after-prayer';
import { sleepAthkar } from './sleep';

export * from './types';
export * from './morning';
export * from './evening';
export * from './after-prayer';
export * from './sleep';

export const athkarCategories: AthkarCategory[] = [
  {
    id: 'morning',
    label: 'أذكار الصباح',
    icon: 'wb_sunny',
    items: morningAthkar,
  },
  {
    id: 'evening',
    label: 'أذكار المساء',
    icon: 'nights_stay',
    items: eveningAthkar,
  },
  {
    id: 'after-prayer',
    label: 'أذكار بعد الصلاة',
    icon: 'mosque',
    items: afterPrayerAthkar,
  },
  {
    id: 'sleep',
    label: 'أذكار النوم',
    icon: 'hotel',
    items: sleepAthkar,
  },
];
