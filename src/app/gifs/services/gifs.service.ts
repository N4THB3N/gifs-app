import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for(let i = 0; i < this.trendingGifs().length; i+=3 ){
      groups.push(this.trendingGifs().slice(i, i +3));
    }
    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

    constructor() {
      this.loadTrendingGifs();
    }

    saveGifsToLocalStorage = effect(() => {
      const historyString = JSON.stringify(this.searchHistory());
      localStorage.setItem(GIF_KEY, historyString);
    })

  loadTrendingGifs(){

    if(this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${ environment.giphyApiUrl }/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20
      }
    }).subscribe((res) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(res.data);
        this.trendingGifs.update(currentGifs => [
          ...currentGifs,
          ...gifs
        ]);
        this.trendingPage.update(current => current + 1)
        this.trendingGifsLoading.set(false);
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
