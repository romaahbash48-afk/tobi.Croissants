"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { BakeryContent, FilterCategory, Weekday } from "@/lib/content";

interface BakerySiteProps {
  content: BakeryContent;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55 },
  },
};

const dayByShortName: Record<string, Weekday> = {
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
  Sun: "sunday",
};

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function getBerlinDayAndTime(): { day: Weekday; minutes: number } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");

  return {
    day: dayByShortName[weekday] ?? "monday",
    minutes: hour * 60 + minute,
  };
}

function isOpenNow(content: BakeryContent): boolean {
  const berlinTime = getBerlinDayAndTime();
  const schedule = content.openingHours.find((item) => item.id === berlinTime.day);

  if (!schedule || !schedule.open || !schedule.close) {
    return false;
  }

  const openMinutes = toMinutes(schedule.open);
  const closeMinutes = toMinutes(schedule.close);

  return berlinTime.minutes >= openMinutes && berlinTime.minutes <= closeMinutes;
}

function formatPrice(value: number): string {
  return `${value.toFixed(1)} €`;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 text-amber-500" aria-label={`Рейтинг: ${count} из 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true">
          {index < count ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default function BakerySite({ content }: BakerySiteProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [heroIndex, setHeroIndex] = useState(0);
  const [openNow, setOpenNow] = useState(() => isOpenNow(content));

  useEffect(() => {
    const heroInterval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % content.heroImages.length);
    }, 5000);

    return () => window.clearInterval(heroInterval);
  }, [content.heroImages.length]);

  useEffect(() => {
    const updateOpenState = () => setOpenNow(isOpenNow(content));

    updateOpenState();

    const statusInterval = window.setInterval(updateOpenState, 60000);
    return () => window.clearInterval(statusInterval);
  }, [content]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return content.products;
    }

    return content.products.filter((item) => item.category === activeCategory);
  }, [activeCategory, content.products]);

  return (
    <div className="min-h-screen bg-[var(--color-pistachio)] text-[var(--color-chocolate)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-pistachio-strong)]/35 bg-[var(--color-pistachio)]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="inline-flex items-center gap-2">
            <span className="rounded-full bg-[var(--color-chocolate)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)]">
              Berlin
            </span>
            <span className="text-lg font-semibold sm:text-xl">{content.brand.name}</span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {content.navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="transition-colors hover:text-[var(--color-chocolate-strong)]"
              >
                {item.label}
              </a>
            ))}
            <motion.a
              href="#contacts"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-[var(--color-chocolate)] px-5 py-2 text-[var(--color-cream)] shadow-md transition-all hover:shadow-lg"
            >
              {content.cta.order}
            </motion.a>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex items-center rounded-full border border-[var(--color-pistachio-strong)] bg-[var(--color-cream)] px-3 py-2 text-sm font-medium md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Открыть мобильное меню"
          >
            {mobileOpen ? "Закрыть" : "Меню"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen ? (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden border-t border-[var(--color-pistachio-strong)]/35 bg-[var(--color-cream)] md:hidden"
            >
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
                {content.navigation.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold tracking-wide"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#contacts"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-fit rounded-full bg-[var(--color-chocolate)] px-4 py-2 text-sm font-semibold text-[var(--color-cream)]"
                >
                  {content.cta.order}
                </a>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <main id="home">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={content.heroImages[heroIndex].url}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={content.heroImages[heroIndex].url}
                  alt={content.heroImages[heroIndex].alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(22,18,16,0.72)] via-[rgba(22,18,16,0.52)] to-[rgba(22,18,16,0.32)]" />
          </div>

          <div className="relative mx-auto grid min-h-[72svh] w-full max-w-6xl items-end px-4 pb-16 pt-24 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="max-w-2xl space-y-5 text-[var(--color-cream)]"
            >
              <span className="inline-flex w-fit rounded-full bg-[var(--color-pistachio-strong)] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-chocolate)]">
                {content.brand.badge}
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                {content.brand.title}
              </h1>
              <p className="max-w-xl text-base text-[var(--color-cream)]/90 sm:text-lg">
                {content.brand.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 pt-3">
                <motion.a
                  href="#menu"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full bg-[var(--color-pistachio-strong)] px-6 py-3 text-sm font-semibold text-[var(--color-chocolate)] shadow-lg"
                >
                  {content.cta.menu}
                </motion.a>
                <motion.a
                  href="#contacts"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border border-[var(--color-cream)]/85 bg-transparent px-6 py-3 text-sm font-semibold text-[var(--color-cream)]"
                >
                  {content.cta.contacts}
                </motion.a>
                <motion.a
                  href={`https://wa.me/${content.contact.whatsApp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full bg-[var(--color-cream)] px-6 py-3 text-sm font-semibold text-[var(--color-chocolate)]"
                >
                  {content.cta.order}
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="menu" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="mb-8 space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-chocolate-soft)]">
              Меню и каталог
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Круассаны и напитки</h2>
            <p className="max-w-2xl text-sm text-[var(--color-chocolate-soft)] sm:text-base">
              Категории фильтруются с анимацией, а цены можно быстро менять через JSON-файл
              без правок в компонентах.
            </p>
          </motion.div>

          <div className="mb-8 flex flex-wrap gap-2">
            {content.categories.map((category) => {
              const selected = category.id === activeCategory;
              return (
                <motion.button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    selected
                      ? "bg-[var(--color-chocolate)] text-[var(--color-cream)]"
                      : "bg-[var(--color-cream)] text-[var(--color-chocolate)] hover:bg-[var(--color-cream-strong)]"
                  }`}
                >
                  {category.label}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.article
                  layout
                  key={product.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-3xl border border-[var(--color-pistachio-strong)]/40 bg-[var(--color-cream)] shadow-[0_10px_30px_rgba(62,52,46,0.12)]"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <span className="rounded-full bg-[var(--color-pistachio-strong)] px-3 py-1 text-sm font-semibold">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-chocolate-soft)]">{product.description}</p>
                    <motion.a
                      whileHover={{ x: 2 }}
                      href="#contacts"
                      className="inline-flex text-sm font-semibold text-[var(--color-chocolate)] underline decoration-[var(--color-pistachio-strong)] underline-offset-4"
                    >
                      Быстрый заказ
                    </motion.a>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="gallery" className="bg-[var(--color-cream)]/65 py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="mb-8 space-y-3"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-chocolate-soft)]">
                Instagram style
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Галерея</h2>
              <p className="max-w-2xl text-sm text-[var(--color-chocolate-soft)] sm:text-base">
                Фото подгружаются из JSON-массива и легко заменяются на ваши Instagram-посты.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {content.gallery.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -5 }}
                  className="group relative block overflow-hidden rounded-2xl border border-[var(--color-pistachio-strong)]/40 bg-white shadow-[0_10px_24px_rgba(62,52,46,0.1)]"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(18,16,14,0.68)] to-transparent px-3 pb-3 pt-8">
                    <p className="text-sm font-medium text-[var(--color-cream)]">{item.caption}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="mb-8 space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-chocolate-soft)]">
              Отзывы
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Что говорят гости</h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {content.reviews.map((review, index) => (
              <motion.article
                key={review.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-[var(--color-pistachio-strong)]/45 bg-[var(--color-cream)] p-5 shadow-[0_10px_20px_rgba(62,52,46,0.08)]"
              >
                <Stars count={review.rating} />
                <p className="mt-3 text-sm text-[var(--color-chocolate-soft)]">{review.text}</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-[var(--color-chocolate-soft)]">{review.source}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="contacts" className="bg-[var(--color-cream)]/75 py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="space-y-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-chocolate-soft)]">
                Контакты
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Заходите за свежей выпечкой</h2>
              <p className="text-sm text-[var(--color-chocolate-soft)] sm:text-base">
                Адрес пекарни: <span className="font-semibold">{content.contact.address}</span>
              </p>

              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  openNow
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    openNow ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {openNow ? "Открыто сейчас" : "Сейчас закрыто"}
              </div>

              <div className="space-y-3 rounded-2xl border border-[var(--color-pistachio-strong)]/45 bg-white/70 p-5">
                {content.openingHours.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-[var(--color-chocolate-soft)]">
                      {item.open && item.close ? `${item.open} - ${item.close}` : "Выходной"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
                  className="rounded-full bg-[var(--color-chocolate)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)]"
                >
                  {content.contact.phone}
                </a>
                <a
                  href={`https://wa.me/${content.contact.whatsApp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="overflow-hidden rounded-3xl border border-[var(--color-pistachio-strong)]/45 shadow-[0_16px_30px_rgba(62,52,46,0.15)]"
            >
              <iframe
                title="Карта tobi.Croissants Berlin"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  content.contact.address,
                )}&output=embed`}
                className="h-full min-h-[380px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-pistachio-strong)]/35 bg-[var(--color-pistachio-strong)]/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-4 px-4 py-6 text-sm sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {content.brand.name}. Fresh pastries in{" "}
            {content.brand.district}.
          </p>
          <div className="flex gap-4 text-[var(--color-chocolate-soft)]">
            <a href={`mailto:${content.contact.email}`} className="hover:underline">
              {content.contact.email}
            </a>
            <a href="#menu" className="hover:underline">
              Menu
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
