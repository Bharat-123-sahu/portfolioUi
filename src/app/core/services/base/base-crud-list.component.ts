import { Directive } from '@angular/core';

@Directive()
export abstract class BaseCrudListComponent<T> {

  loading = false;

  data: T[] = [];
  filteredData: T[] = [];
  paginatedData: T[] = [];

  searchTerm = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  protected abstract filterPredicate(item: T, search: string): boolean;

  protected setData(data: T[]): void {
    this.data = data;
    this.filteredData = [...data];
    this.currentPage = 1;
    this.updatePagination();
  }

  search(value: string): void {

    value = value.toLowerCase();

    this.searchTerm = value;

    if (!value) {

      this.filteredData = [...this.data];

    } else {

      this.filteredData = this.data.filter(item =>
        this.filterPredicate(item, value)
      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredData.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedData =
      this.filteredData.slice(start, start + this.pageSize);

  }

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();

    }

  }

}