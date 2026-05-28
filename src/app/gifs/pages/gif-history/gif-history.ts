import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifList } from "../../components/gif-list/gif-list";
import { LocalStorage } from '../../services/local-storage.service';

@Component({
  selector: 'app-gif-history',
  imports: [GifList],
  templateUrl: './gif-history.html',
  styleUrl: './gif-history.css',
})
export default class GifHistory {

  gifService = inject(GifService);
  localStorage = inject(LocalStorage);

  query = toSignal(inject(ActivatedRoute).params.pipe(
    map(params => params['query'] ?? 'No query')
  ));

  gifsByKey = computed(() => {
    this.localStorage.setItem('gif_history', this.query());
    return this.gifService.getHistoryGifs(this.query());
  });
}
