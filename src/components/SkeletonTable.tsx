type SkeletonTableProps = {
  rows?: number;
  columns?: string[];
};

export default function SkeletonTable({
  rows = 6,
  columns = ["20%", "40%", "24%", "16%"],
}: SkeletonTableProps) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-row">
          {columns.map((width, colIndex) => (
            <div
              key={colIndex}
              className="skeleton-box"
              style={{ width }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}