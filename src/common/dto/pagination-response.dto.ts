export class PaginationResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  offset: number;

  constructor(
    data: T[],
    total: number,
    page: number,
    limit: number,
    offset: number,
  ) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.offset = offset;
  }

  getTotalPages(total: number, limit: number) {
    return Math.ceil(total / limit);
  }
}
