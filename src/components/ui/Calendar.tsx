import { useTranslation } from 'react-i18next'

const Calendar = () => {
  const { t, i18n } = useTranslation()
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDate = today.getDate()

  // Detect current language (default to Spanish)
  const currentLang = i18n.language?.startsWith('en')
    ? 'en'
    : i18n.language?.startsWith('pt')
      ? 'pt'
      : 'es'

  // Translation dictionaries for months and weekdays
  const locales = {
    es: {
      weekdays: ["L", "M", "M", "J", "V", "S", "D"],
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      ]
    },
    en: {
      weekdays: ["M", "T", "W", "T", "F", "S", "S"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    },
    pt: {
      weekdays: ["S", "T", "Q", "Q", "S", "S", "D"],
      months: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ]
    }
  }

  const activeLocale = locales[currentLang] || locales.es
  const monthNames = activeLocale.months
  const weekdays = activeLocale.weekdays

  // Primer día del mes
  const firstDay = new Date(year, month, 1).getDay();

  // Ajustar para que lunes sea 0
  const startDay = firstDay === 0 ? 6 : firstDay - 1

  // Total días del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Total días del mes anterior
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { day: number; currentMonth: boolean }[] = []

  // Días del mes anterior
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      currentMonth: false,
    });
  }

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      currentMonth: true,
    });
  }

  // Completar grilla
  const remaining = 42 - days.length;

  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      currentMonth: false,
    });
  }

  return (
    <div
      className="
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        rounded-2xl
        p-4
        shadow-sm
        transition-colors
      "
    >
      {/* TÍTULO */}
      <h3 className="font-semibold text-textMain dark:text-gray-100 mb-2">
        {t('common.calendar', 'Calendario')}
      </h3>

      {/* FECHA */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {monthNames[month]} {year}
      </p>

      {/* DÍAS SEMANA */}
      <div className="grid grid-cols-7 text-xs text-center text-gray-400 dark:text-gray-500 mb-2">
        {weekdays.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* CALENDARIO */}
      <div className="grid grid-cols-7 text-xs text-center gap-y-1">
        {days.map((d, i) => (
          <span
            key={i}
            className={`py-0.5 rounded-full ${d.day === todayDate && d.currentMonth
              ? 'bg-primary text-white font-bold'
              : !d.currentMonth
                ? "text-gray-300 dark:text-gray-600"
                : "text-textMain dark:text-gray-300"
              }`}
          >
            {d.day}
          </span>
        ))}
      </div>
    </div >
  )
}

export default Calendar
