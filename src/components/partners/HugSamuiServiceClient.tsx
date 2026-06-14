"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import {
  getHugSamuiService,
  getHugSamuiServiceGroup,
  type HugSamuiService,
  type HugSamuiServiceDataset,
} from "@/data/hugSamuiServices";
import { useL, useT } from "@/lib/i18n";
import partnersDict from "@/lib/i18n/dictionaries/partners";

export function HugSamuiServiceClient({
  data,
}: {
  data: HugSamuiServiceDataset;
}) {
  const t = useT(partnersDict);
  const l = useL();
  const heroServices = data.services.slice(0, 4);

  return (
    <article className="bg-cream-50 pb-28 text-ink md:pb-16">
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-9 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)] md:px-6 md:py-12">
          <div className="flex flex-col justify-center">
            <Link
              href={data.futureRoutes.partnerDetail}
              className="inline-flex w-fit items-center gap-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:text-teal-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.serviceBack}
            </Link>

            <h1 className="mt-7 max-w-[44rem] font-display text-3xl font-semibold leading-tight text-teal-900 sm:text-[2.15rem] md:text-[2.45rem]">
              {t.servicePageTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-ink-soft md:text-[0.96rem]">
              {l(data.positioning.summary)}
            </p>
            <p className="mt-3 max-w-2xl text-[0.86rem] leading-relaxed text-ink-soft md:text-[0.92rem]">
              {t.servicePageDescription}
            </p>

            <div className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-gold-400/30 border-y border-gold-400/25 py-3.5">
              <Stat value={data.services.length} label={t.serviceStatsServices} />
              <Stat
                value={data.serviceGroups.length}
                label={t.serviceStatsGroups}
              />
              <Stat value={t.serviceStatsFlowValue} label={t.serviceStatsFlow} />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="#service-list" size="sm" className="px-5 py-2.5 text-[0.84rem]">
                {t.serviceHeroPrimaryCta}
              </ButtonLink>
              <ButtonLink
                href={data.futureRoutes.partnerDetail}
                variant="secondary"
                size="sm"
                className="px-5 py-2.5 text-[0.84rem]"
              >
                {t.serviceHeroSecondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-[31rem] grid-cols-2 gap-3 md:gap-4">
            {heroServices.map((service, index) => {
              const image = service.media[0];
              if (!image) return null;
              return (
                <figure
                  key={service.id}
                  className={`relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-teal-900 shadow-soft ${
                    index % 2 === 1 ? "translate-y-6" : ""
                  }`}
                >
                  <Image
                    src={image.publicPath}
                    alt={l(image.alt)}
                    fill
                    sizes="(max-width: 767px) 45vw, 18rem"
                    className="object-cover"
                    priority={index < 2}
                  />
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-teal-900/10 bg-cream-100">
        <div className="mx-auto max-w-6xl px-4 py-9 md:px-6 md:py-12">
          <div className="grid gap-8 md:grid-cols-[0.72fr_1fr] md:items-start">
            <div>
              <h2 className="font-display text-2xl font-semibold leading-tight text-teal-900 md:text-[2rem]">
                {t.serviceGroupsTitle}
              </h2>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-soft md:text-[0.95rem]">
                {l(data.positioning.businessModel)}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {data.serviceGroups.map((group) => (
                <article
                  key={group.id}
                  className="rounded-[1rem] border border-teal-900/10 bg-white p-4 shadow-soft"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
                    {String(group.sortOrder).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2.5 text-[0.98rem] font-semibold leading-snug text-teal-900">
                    {l(group.name)}
                  </h3>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-soft md:text-[0.9rem]">
                    {l(group.description)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-9 md:px-6 md:py-12">
          <h2 className="font-display text-2xl font-semibold leading-tight text-teal-900 md:text-[2rem]">
            {t.dailyFlowTitle}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {data.dailyFlow.map((flow) => (
              <article
                key={flow.id}
                className="rounded-[1rem] border border-teal-900/10 bg-cream-50 p-4"
              >
                <p className="text-[0.84rem] font-semibold text-gold-600">
                  {l(flow.period)}
                </p>
                <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-soft md:text-[0.9rem]">
                  {l(flow.summary)}
                </p>
                <div className="mt-4 space-y-2">
                  {flow.serviceIds.map((serviceId) => {
                    const service = getHugSamuiService(serviceId);
                    if (!service) return null;
                    return (
                      <div
                        key={serviceId}
                        className="flex items-center justify-between gap-3 border-t border-teal-900/10 pt-2 text-[0.84rem]"
                      >
                        <span className="font-medium text-ink">
                          {l(service.shortName)}
                        </span>
                        <span className="text-ink-faint">
                          {l(service.schedule.timeLabel)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="service-list" className="bg-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-9 md:px-6 md:py-14">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold leading-tight text-teal-900 md:text-[2rem]">
              {t.serviceListTitle}
            </h2>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-soft md:text-[0.95rem]">
              {t.serviceListDescription}
            </p>
          </div>

          <div className="mt-6 space-y-4 md:space-y-5">
            {data.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-9 md:flex-row md:items-center md:justify-between md:px-6 md:py-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold leading-tight text-teal-900 md:text-[2rem]">
              {t.futureFoodTitle}
            </h2>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-soft md:text-[0.95rem]">
              {t.futureFoodDescription}
            </p>
          </div>
          <ButtonLink
            href={data.futureRoutes.wellnessFood}
            variant="secondary"
            size="sm"
            className="px-5 py-2.5 text-[0.84rem]"
          >
            {t.futureFoodCta}
          </ButtonLink>
        </div>
      </section>
    </article>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <p className="font-display text-[1.55rem] font-semibold leading-none text-gold-600 md:text-[1.85rem]">
        {value}
      </p>
      <p className="mt-1 text-[0.74rem] font-medium leading-snug text-ink-faint md:text-[0.82rem]">
        {label}
      </p>
    </div>
  );
}

function ServiceCard({ service }: { service: HugSamuiService }) {
  const t = useT(partnersDict);
  const l = useL();
  const group = getHugSamuiServiceGroup(service.serviceGroupId);
  const image = service.media[0];

  return (
    <article className="grid overflow-hidden rounded-[1.1rem] border border-teal-900/10 bg-white shadow-soft md:grid-cols-[minmax(220px,320px)_1fr]">
      <div className="relative aspect-[4/5] min-h-[16rem] bg-teal-900 md:aspect-auto">
        {image && (
          <Image
            src={image.publicPath}
            alt={l(image.alt)}
            fill
            sizes="(max-width: 767px) 100vw, 360px"
            className="object-cover"
          />
        )}
      </div>

      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {group && (
            <span className="rounded-full border border-gold-400/50 bg-gold-100/40 px-3 py-1 text-[0.68rem] font-semibold text-gold-600">
              {l(group.name)}
            </span>
          )}
          <span className="rounded-full bg-teal-50 px-3 py-1 text-[0.68rem] font-semibold text-teal-700">
            {l(service.booking.label)}
          </span>
        </div>

        <h3 className="mt-4 font-display text-[1.45rem] font-semibold leading-tight text-teal-900 md:text-[1.75rem]">
          {l(service.name)}
        </h3>
        <p className="mt-3 text-[0.88rem] font-semibold leading-relaxed text-ink md:text-[0.94rem]">
          {l(service.summary)}
        </p>
        <p className="mt-2.5 text-[0.84rem] leading-relaxed text-ink-soft md:text-[0.9rem]">
          {l(service.description)}
        </p>

        <dl className="mt-5 grid gap-3 border-y border-teal-900/10 py-4 text-[0.84rem] sm:grid-cols-2">
          <MetaItem
            icon={<Clock3 className="h-4 w-4" />}
            label={t.serviceTime}
            value={l(service.schedule.timeLabel)}
          />
          <MetaItem
            icon={<CalendarDays className="h-4 w-4" />}
            label={t.servicePrice}
            value={l(service.price.label)}
          />
          <MetaItem
            icon={<MapPin className="h-4 w-4" />}
            label={t.serviceLocation}
            value={l(service.location.area)}
          />
          <MetaItem
            label={t.serviceBooking}
            value={l(service.booking.label)}
          />
        </dl>

        <div className="mt-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
            {t.serviceAudience}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {service.audience.map((audience) => (
              <span
                key={audience.en}
                className="rounded-full bg-cream-100 px-3 py-1 text-[0.74rem] font-medium text-ink-soft"
              >
                {l(audience)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-teal-900/10 pt-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
            {t.serviceBusinessRole}
          </p>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-soft md:text-[0.9rem]">
            {l(service.businessRole)}
          </p>
        </div>
      </div>
    </article>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      {icon && (
        <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full bg-teal-50 text-teal-700">
          {icon}
        </span>
      )}
      <div>
        <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
          {label}
        </dt>
        <dd className="mt-0.5 text-[0.84rem] font-semibold leading-snug text-ink">
          {value}
        </dd>
      </div>
    </div>
  );
}
