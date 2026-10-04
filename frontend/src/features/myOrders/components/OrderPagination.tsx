import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
interface ItemPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function OrderPagination({
  page,
  onPageChange,
  totalPages,
  total,
  limit,
}: ItemPaginationProps) {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="pt-8 flex items-center justify-between">
      <Typography
        variant={"caption"}
        className="text-[13px] text-content-secondary"
      >
        Showing {start}-{end} of {total} orders
      </Typography>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          children={"Previous"}
          className="border-page-tertiary rounded-[6px]! text-content-secondary"
          size="small"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        ></Button>
        <Button
          variant="secondary"
          children={"Next"}
          size="small"
          disabled={page === totalPages}
          className="border-page-tertiary rounded-[6px]! text-content-secondary"
          onClick={() => onPageChange(page + 1)}
        ></Button>
      </div>
    </div>
  );
}
