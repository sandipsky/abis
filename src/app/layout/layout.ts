import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { ConfigurationService } from '@/modules/settings/configuration/configuration.service';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Sidebar, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout implements OnInit {
  private _configurationService = inject(ConfigurationService);

  isCollapsed = false;

  ngOnInit() {
    this._configurationService.getConfigurations().subscribe();
  }
}
