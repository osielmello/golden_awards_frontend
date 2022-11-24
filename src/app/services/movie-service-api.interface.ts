import { Observable } from "rxjs";
import { YearsWithMultipleWinners } from "../models/years-with-multiple-winners";
import { StudiosWithWinCount } from "../models/studios-with-win-count";
import { MaxMinWinIntervalForProducers } from "../models/max-min-win-interval-for-producers";
import { Movie } from "../models/movie";
import { FilterMovie } from "../models/filter-movie";
import { Data } from "../models/data";

/**
 * API Service.
 *
 * @author Osiel.
 */
export interface MovieServiceApi {

  yearsWithMultipleWinners$(): Observable<YearsWithMultipleWinners>;

  top3StudiosWithWinCount$(): Observable<StudiosWithWinCount>;

  maxMinWinIntervalForProducers$(): Observable<MaxMinWinIntervalForProducers>;

  movieWinnersByYear$(year: number): Observable<Movie[]>;

  filterMovies$(filter: FilterMovie): Observable<Data>;
}
