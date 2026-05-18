import {Component } from '@angular/core';
import GifsSideMenuHeader from '../gifs-side-menu-header/gifs-side-menu-header';
import GifsSideMenuOptions from '../gifs-side-menu-options/gifs-side-menu-options';

@Component({
  selector: 'gifs-side-menu',
  imports: [    GifsSideMenuHeader,
    GifsSideMenuOptions,],
  templateUrl: './side-menu.html',
})
export class SideMenu { }
