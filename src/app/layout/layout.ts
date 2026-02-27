import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Sidebar, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
