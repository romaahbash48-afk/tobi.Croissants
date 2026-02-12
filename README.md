# tobi.Croissants Berlin Website

Интерактивный адаптивный сайт пекарни для Berlin-Wilmersdorf на:

- Next.js (App Router, SSG/ISR)
- React
- Tailwind CSS
- Framer Motion

## Быстрый старт

```bash
npm install
npm run dev
```

Открыть: `http://localhost:3000`

## Где редактировать контент (JSON CMS-ready)

Весь контент сайта хранится в файле:

- `src/data/bakery-content.json`

Там можно менять:

- продукты и цены (`products`)
- категории (`categories`)
- фото меню и галереи (`heroImages`, `gallery`)
- тексты (hero, отзывы, контакты)
- расписание (`openingHours`)

Типы данных находятся в `src/lib/content.ts`.

## Секции сайта

- Hero с CTA-кнопками
- Каталог с фильтрами категорий и анимациями
- Галерея Instagram-style
- Контакты (адрес, карта Google Maps iframe, расписание, WhatsApp)
- Отзывы

## UX и анимации

- fade/slide при скролле
- hover-zoom карточек и фото
- микровзаимодействия кнопок
- плавная анимация переключения фильтров меню

## SEO

- metadata/openGraph в `src/app/layout.tsx`
- оптимизированные изображения через `next/image`
- страница статически генерируется с `revalidate`