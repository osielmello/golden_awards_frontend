import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
import { environment } from "../environments/environment";
import { YearsWithMultipleWinners } from "../models/years-with-multiple-winners";
import { StudiosWithWinCount } from "../models/studios-with-win-count";
import { MaxMinWinIntervalForProducers } from "../models/max-min-win-interval-for-producers";
import { Movie } from "../models/movie";
import { FilterMovie } from "../models/filter-movie";
import { Data } from "../models/data";
import { MovieServiceApi } from "./movie-service-api.interface";

/**
 * Serviço de comunicação com a API TEXOIT
 *
 * @author Osiel.
 */
@Injectable({providedIn: "root"})
export class MovieService implements MovieServiceApi {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Anos com múltiplos vencedores.
   */
  yearsWithMultipleWinners$(): Observable<YearsWithMultipleWinners> {
    const params: HttpParams = new HttpParams()
      .set("projection", "years-with-multiple-winners");

    return this.httpClient.get<YearsWithMultipleWinners>(`${environment.baseUrl}`, {params})
      .pipe(
        catchError(() => of({years: []} as YearsWithMultipleWinners)),
      );
  }

  /**
   * Top 3 de estúdios.
   */
  top3StudiosWithWinCount$(): Observable<StudiosWithWinCount> {
    const params: HttpParams = new HttpParams()
      .set("projection", "studios-with-win-count");

    return this.httpClient.get<StudiosWithWinCount>(`${environment.baseUrl}`, {params})
      .pipe(
        map((result: StudiosWithWinCount) => {
          result.studios.sort((s1, s2) => s2.winCount - s1.winCount);
          result.studios = result.studios.slice(0, 3);

          return result;
        }),
        catchError(() => of({studios: []} as StudiosWithWinCount)),
      );
  }

  /**
   * Maior e menor intervalo de produtores vencedores.
   */
  maxMinWinIntervalForProducers$(): Observable<MaxMinWinIntervalForProducers> {
    const params: HttpParams = new HttpParams()
      .set("projection", "max-min-win-interval-for-producers");

    return this.httpClient.get<MaxMinWinIntervalForProducers>(`${environment.baseUrl}`, {params})
      .pipe(
        catchError(() => of({min: [], max: []} as MaxMinWinIntervalForProducers)),
      );
  }

  /**
   * Filmes vencedores por ano.
   * @param year
   */
  movieWinnersByYear$(year: number): Observable<Movie[]> {
    const params: HttpParams = new HttpParams()
      .set("winner", "true")
      .set("year", year);

    return this.httpClient.get<Movie[]>(`${environment.baseUrl}`, {params})
      .pipe(
        catchError(() => of([])),
      );
  }

  /**
   * Busca os filmes com um conjunto de parâmetros.
   * @param filter
   */
  filterMovies$(filter: FilterMovie): Observable<Data> {
    let params: HttpParams = new HttpParams()
      .set("page", filter.page ? filter.page : 0)
      .set("size", filter.size ? filter.size : 12);

    if (filter.winner !== undefined) {
      params = params.set("winner", filter.winner)
    }

    if (filter.year) {
      params = params.set("year", filter.year)
    }

    return this.httpClient.get<Data>(`${environment.baseUrl}`, {params})
      .pipe(
        catchError(() => of({} as Data)),
      );
  }

}
