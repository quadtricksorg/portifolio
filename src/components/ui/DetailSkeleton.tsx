/**
 * Placeholder for detail pages (services, projects) while route params resolve.
 * Matches the page-intro layout so nothing jumps when content arrives.
 */
export function DetailSkeleton() {
  const block = "rounded-sm bg-surface-2 motion-safe:animate-[pulse-soft_1.6s_ease-in-out_infinite]";
  return (
    <section aria-busy="true" aria-label="Loading" className="container-x pt-28 pb-16 sm:pt-36 lg:pt-44">
      <div className={`${block} h-3 w-40`} />
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div className={`${block} h-3 w-28`} />
          <div className={`${block} h-12 w-full max-w-[36rem]`} />
          <div className={`${block} h-12 w-3/4 max-w-[28rem]`} />
        </div>
        <div className="flex flex-col gap-3 lg:col-span-5 lg:self-end">
          <div className={`${block} h-4 w-full`} />
          <div className={`${block} h-4 w-5/6`} />
          <div className={`${block} h-4 w-2/3`} />
        </div>
      </div>
      <div className={`${block} chamfer mt-12 aspect-[16/9] w-full lg:mt-16`} />
    </section>
  );
}
