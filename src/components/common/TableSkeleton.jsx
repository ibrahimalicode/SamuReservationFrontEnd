const TableSkeleton = ({ rows = 4 }) => {
  let rowsMap = [];

  for (let i = 0; i < rows; i++) {
    rowsMap.push(i);
  }
  return (
    <div
      role="status"
      className="w-full animate-pulse sm:rounded-lg overflow-clip"
    >
      <div className="h-12 bg-gray-50 dark:bg-gray-700 w-full mb-0.5"></div>
      {rowsMap.map((i) => (
        <div
          key={i}
          className="h-14 w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 last:border-b-0"
        ></div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default TableSkeleton;
