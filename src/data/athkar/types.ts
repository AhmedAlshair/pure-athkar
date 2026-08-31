export interface ThikrItem {
  id: string;
  arabic: string;
  translation?: string;
  reference?: string;
  count: number;
  order?: number;
  isQuranic?: boolean;
  prefix?: string;
  suffix?: string;
}

export interface AthkarCategory {
  id: string;
  label: string;
  icon?: string;
  items: ThikrItem[];
  order?: number;
}
