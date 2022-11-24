import { Movie } from "./movie";
import { Pageable } from "./pageable";
import { Sort } from "./sort";

export interface Data {
  content: Movie[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
