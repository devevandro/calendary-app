export function getBrazilianHoliday(date: Date): string | null {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const fixedHolidays: Record<string, string> = {
    "1/1": "Confraternização Universal",
    "15/2": "Feriado Municipal",
    "21/4": "Tiradentes",
    "1/5": "Dia do Trabalho",
    "7/9": "Independência do Brasil",
    "12/10": "Nossa Senhora Aparecida",
    "2/11": "Finados",
    "15/11": "Proclamação da República",
    "20/11": "Consciência Negra",
    "25/12": "Natal",
  };

  const fixedKey = `${day}/${month}`;
  if (fixedHolidays[fixedKey]) {
    return fixedHolidays[fixedKey];
  }

  function calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
  }

  const easter = calculateEaster(year);

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  const carnival = new Date(easter);
  carnival.setDate(easter.getDate() - 47);

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);

  if (day === easter.getDate() && month === easter.getMonth() + 1) {
    return "Páscoa";
  }

  if (day === goodFriday.getDate() && month === goodFriday.getMonth() + 1) {
    return "Sexta-feira Santa";
  }

  if (day === carnival.getDate() && month === carnival.getMonth() + 1) {
    return "Carnaval";
  }

  if (
    day === corpusChristi.getDate() &&
    month === corpusChristi.getMonth() + 1
  ) {
    return "Corpus Christi";
  }

  return null;
}

export function isHoliday(date: Date): boolean {
  return getBrazilianHoliday(date) !== null;
}
