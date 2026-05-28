import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

    constructor() {
      this.loadTrendingGifs();
    }

  loadTrendingGifs(){
    this.http.get<GiphyResponse>(`${ environment.giphyApiUrl }/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20
      }
    }).subscribe((res) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(res.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log(gifs);
    });
  }

  searchGifs(query: string):Observable<Gif[]>{
    return this.http.get<GiphyResponse>(`${ environment.giphyApiUrl }/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query,
      }
    }).pipe(
      map(({data}) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      tap(items => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()]: items,

        }))
      })

      // TODO: Historial.
    );

    // .subscribe((res) => {
    //     const gifs = GifMapper.mapGiphyItemsToGifArray(res.data);
    //     console.log({search: gifs});
    // });

  }

  getHistoryGifs(query: string){
    return this.searchHistory()[query] ?? [];
  }


}
