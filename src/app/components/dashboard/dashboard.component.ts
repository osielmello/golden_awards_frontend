import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { MovieService } from "../../services/movie-service";
import { BehaviorSubject, map, Observable, Subscription, switchMap } from "rxjs";
import { YearsWithMultipleWinners } from "../../models/years-with-multiple-winners";
import { StudiosWithWinCount } from "../../models/studios-with-win-count";
import { MaxMinWinIntervalForProducers } from "../../models/max-min-win-interval-for-producers";
import { ProducerInterval } from "../../models/producer-interval";
import { Movie } from "../../models/movie";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

interface SearchForm {
  year: FormControl<number | null>;
}

/**
 * Dashboard com dados variados de filmes e produtores.
 *
 * @author Osiel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {

  searchForm: FormGroup<SearchForm>;
  yearsWithMultipleWinners$: Observable<YearsWithMultipleWinners>;

  studiosWithWinCount$: Observable<StudiosWithWinCount>;
  maxWinIntervalForProducers$: Observable<ProducerInterval[]>;

  minWinIntervalForProducers$: Observable<ProducerInterval[]>;
  moviesByYear$: BehaviorSubject<Movie[]>

  private readonly winIntervalForProducers$: BehaviorSubject<MaxMinWinIntervalForProducers>;
  private readonly evtSearch: EventEmitter<number>;
  private readonly subscription: Subscription;

  constructor(private movieService: MovieService, private formBuilder: FormBuilder) {
    this.evtSearch = new EventEmitter<number>();
    this.searchForm = this.formBuilder.group<SearchForm>({
      year: new FormControl(),
    });
    this.winIntervalForProducers$ = new BehaviorSubject<MaxMinWinIntervalForProducers>({min: [], max: []});
    this.moviesByYear$ = new BehaviorSubject<Movie[]>([]);

    this.yearsWithMultipleWinners$ = movieService.yearsWithMultipleWinners$();
    this.studiosWithWinCount$ = movieService.top3StudiosWithWinCount$();

    this.maxWinIntervalForProducers$ = this.winIntervalForProducers$.pipe(map(m => m.max));
    this.minWinIntervalForProducers$ = this.winIntervalForProducers$.pipe(map(m => m.min));

    this.subscription = new Subscription();

    this.subscription
      .add(movieService.maxMinWinIntervalForProducers$()
        .subscribe(this.winIntervalForProducers$));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription
      .add(this.evtSearch
        .pipe(
          switchMap<number, Observable<Movie[]>>((year: number) => this.movieService.movieWinnersByYear$(year))
        )
        .subscribe(this.moviesByYear$));
  }

  onSearch(): void {
    const year: number | null = this.searchForm.controls.year.value;
    if (year) {
      this.evtSearch.emit(year);
    }
  }

}
