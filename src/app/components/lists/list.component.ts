import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MovieService } from "../../services/movie-service";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  skip,
  Subscription,
  switchMap,
  tap
} from "rxjs";
import { Data } from "../../models/data";
import { FilterMovie } from "../../models/filter-movie";
import { Movie } from "../../models/movie";

const SHOW_PAGES = 5;

enum WinnerEnum {
  YES_NO = "YES_NO",
  YES = "YES",
  NO = "NO"
}

/**
 * View de listagem de filmes páginados e com filtros.
 *
 * @author Osiél.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit, OnDestroy {

  data$: BehaviorSubject<Data>;
  filter$: BehaviorSubject<FilterMovie>;
  movies$: Observable<Movie[]>;

  // Controle de páginas
  actualPage$: BehaviorSubject<number>;
  rangePages$: Observable<number[]>;
  showPages$: BehaviorSubject<number[]>;
  pageCountView$: BehaviorSubject<number>;

  @ViewChild("yearInput", {static: true}) yearIp!: ElementRef;
  @ViewChild("winnerSelect", {static: true}) winnerSel!: ElementRef;

  private loading?: boolean;
  private subscription: Subscription;

  constructor(private movieService: MovieService) {
    this.actualPage$ = new BehaviorSubject(1); // TODO DECREMENTAR AO BUSCAR
    this.data$ = new BehaviorSubject<Data>({totalPages: 0} as Data);
    this.filter$ = new BehaviorSubject<FilterMovie>({});
    this.movies$ = this.data$.pipe(map(d => d.content));
    this.pageCountView$ = new BehaviorSubject(0);
    this.subscription = new Subscription();

    /**
     * Range das possíveis páginas.
     */
    this.rangePages$ = this.data$
      .pipe(
        map(data => Array(data.totalPages).fill(0).map((v, i) => i + 1))
      );
    this.showPages$ = new BehaviorSubject<number[]>([1, 2, 3, 4, 5]);

    /**
     * Combina o range com o contador de páginas para atualizar as visíveis setando o limite {@link SHOW_PAGES}.
     */
    this.subscription
      .add(combineLatest([
        this.rangePages$, this.pageCountView$,
      ])
        .pipe(
          map(([pages, pageCount]) => pages.slice(pageCount, pageCount + SHOW_PAGES)))
        .subscribe(this.showPages$));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.addChangedPage();
    this.addChangedYear();
    this.addChangedWinner();
    this.addFilter();
  }

  /**
   * Atualiza a página.
   * @param page
   */
  setPage(page: number) {
    this.actualPage$.next(page);
  }

  incrementPage(): void {
    const pageCount = this.pageCountView$.value;

    /*
     * Se a página contada mais a soma das páginas visíveis for maior que o total, então não deve incrementar.
     */
    if (pageCount + SHOW_PAGES < this.data$.value.totalPages) {

      const nextPage = this.actualPage$.value + 1;

      /*
      * Só renderiza mais páginas quando a próxima página não estiver no range
      */
      if (!this.showPages$.value.includes(nextPage)) {
        this.pageCountView$.next(pageCount + 1);
      }

      this.setPage(nextPage)
    }
  }

  decrementPage(): void {
    const actualPage = this.actualPage$.value;
    /*
     * Começa com 1, sendo assim, não pode decrementar
     */
    if (actualPage > 1) {

      const previousPage = actualPage - 1;

      /*
       * Só renderiza mais páginas quando a página anterior não estiver no range
       */
      if (!this.showPages$.value.includes(previousPage)) {
        this.pageCountView$.next(this.pageCountView$.value - 1);
      }

      this.setPage(previousPage);
    }
  }

  /**
   * Quando a página for atualizada, dispara novamente os filtros.
   * @private
   */
  private addChangedPage(): void {
    this.actualPage$
      .pipe(
        skip(1),
        distinctUntilChanged(),
        debounceTime(100),
        filter(() => !this.loading),
      )
      .subscribe((page: number) => {
        this.loading = true;
        const filter: FilterMovie = this.filter$.value;
        this.filter$.next({...filter, page: page - 1});
      });
  }

  /**
   * Adiciona a condição de ano.
   * @private
   */
  private addChangedYear(): void {
    this.subscription
      .add(fromEvent(this.yearIp.nativeElement, "keyup")
        .pipe(
          map((e: any) => e.target.value),
          filter((value) => !value || value.toString().length === 4),
          debounceTime(250),
          distinctUntilChanged(),
          filter(() => !this.loading),
        )
        .subscribe((year: number) => {
          this.loading = true;
          this.actualPage$.next(0);
          this.pageCountView$.next(0);
          const filter: FilterMovie = this.filter$.value;
          this.filter$.next({...filter, page: 0, year});
        }));
  }

  /**
   * Adiciona a condição de winner.
   * @private
   */
  private addChangedWinner(): void {
    this.subscription
      .add(fromEvent(this.winnerSel.nativeElement, "change")
        .pipe(
          map((e: any) => e.target.value),
          debounceTime(250),
          distinctUntilChanged(),
          filter(() => !this.loading),
        )
        .subscribe((value: WinnerEnum) => {
          this.loading = true;
          this.actualPage$.next(0);
          this.pageCountView$.next(0);
          const filter: FilterMovie = this.filter$.value;
          const winner = value === WinnerEnum.YES ? true : value === WinnerEnum.NO ? false : undefined;
          this.filter$.next({...filter, page: 0, winner});
        }));
  }

  /**
   * Dispara um novo ciclo de pesquisa,
   * @private
   */
  private addFilter(): void {
    this.subscription
      .add(this.filter$
        .pipe(
          switchMap(filter => this.movieService.filterMovies$(filter)),
          tap(() => this.loading = false),
        )
        .subscribe(this.data$));
  }
}
