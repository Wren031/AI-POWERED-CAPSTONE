type SkeletonCardsProps = {
  count?: number;
};

export default function SkeletonCards({ count = 5 }: SkeletonCardsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-box title" />
          <div className="skeleton-box text" />
          <div className="skeleton-box text short" />
        </div>
      ))}
    </>
  );
}