import {Component, input } from '@angular/core';

@Component({
  selector: 'gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.html',
})
export default class GifListItem {
  imageUrl = input.required<string>();
}
