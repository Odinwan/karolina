/**
 * ГЛАВНЫЕ НАСТРОЙКИ САЙТА
 * ------------------------------------------------------------
 * Всё, что владелец сайта может менять без правки дизайна, — здесь.
 * После изменения: `npm run build` и загрузить папку `dist` на хостинг.
 */

export type ContactLink = {
  /** Подпись ссылки, например «Telegram» или «Instagram» */
  label: string
  /** Полный адрес: https://t.me/username, mailto:hello@site.ru и т. п. */
  url: string
  /** Иконка: 'instagram' | 'telegram' | 'link' (по умолчанию 'link') */
  icon?: 'instagram' | 'telegram' | 'link'
}

export const siteConfig = {
  /** Название бренда (используется в подписях и на карточке) */
  brandName: 'missmalofii',

  /** Имя автора для финальной подписи */
  authorName: 'Каролина Купная',

  /** Роль под подписью */
  authorRole: 'психолог',

  /** Отметка на сохраняемой карточке */
  cardDateLabel: 'December 2026',

  /**
   * Ссылка на PDF-гайд.
   * Вариант 1 (по умолчанию): положите свой файл в `public/guide/`
   *   под тем же именем — и ничего больше менять не нужно.
   * Вариант 2: укажите внешнюю ссылку (Google Drive, Яндекс Диск и т. п.).
   */
  guideUrl: 'guide/missmalofii-december-guide.pdf',

  /** Имя файла, под которым гайд сохранится у посетителя */
  guideFileName: 'Christmas mood — гайд декабря missmalofii.pdf',

  /**
   * Ссылка на запись на сессию (Telegram, WhatsApp, форма, сервис записи…).
   * ⚠️ Пока поле пустое, кнопка «записаться на сессию» не показывается,
   * чтобы на сайте не было неработающих элементов.
   * Пример: 'https://t.me/your_username'
   */
  bookingUrl: '',

  /**
   * Ссылки в финальном блоке сайта. Пустой список — блок не показывается.
   */
  /**
   * Фоновая музыка. Файл лежит в `public/audio/`.
   * Чтобы отключить музыку на сайте — поставьте musicUrl: ''.
   */
  musicUrl: 'audio/most-wonderful-time.mp3',
  /** Громкость, 0…1 */
  musicVolume: 0.35,

  /**
   * Ник в Instagram для просьбы отметить в stories (под посланием).
   * Пустая строка — строка не показывается.
   */
  instagramHandle: 'missmalofii',
  instagramUrl: 'https://www.instagram.com/missmalofii/',

  /** Подпись разработчика внизу сайта. Чтобы убрать — поставьте null */
  developerCredit: { label: 'odinwan', url: 'https://odinwan.github.io/' } as ContactLink | null,

  contactLinks: [
    { label: 'instagram', url: 'https://www.instagram.com/missmalofii/', icon: 'instagram' },
    { label: 'telegram-канал', url: 'https://t.me/missmalofiipsy', icon: 'telegram' },
  ] as ContactLink[],
}
