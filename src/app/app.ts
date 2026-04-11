import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinner } from './shared/components/loading-spinner/loading-spinner';
import { ConfigurationService } from './shared/services/configuration.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinner],
  templateUrl: './app.html',
})
export class App {
  private _configurationService = inject(ConfigurationService);

  constructor() {
    this._configurationService.loadSavedPreferences();
  }

}
