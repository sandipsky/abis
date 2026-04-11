import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
    applyAccent(colorValue: string) {
        const body = document.body;

        // remove all accent classes first
        body.classList.remove('accent-green', 'accent-blue', 'accent-red');

        switch (colorValue) {
            case '1': // Green
                body.classList.add('accent-green');
                break;

            case '0': // Blue
                body.classList.add('accent-blue');
                break;

            default:
                body.classList.add('accent-green');
        }

        localStorage.setItem('accent', colorValue);
    }

    applyTheme(themeValue: string) {
        const body = document.body;

        if (themeValue === '0') {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }

        localStorage.setItem('theme', themeValue);
    }

    loadSavedPreferences() {
        const savedTheme = localStorage.getItem('theme');
        const savedAccent = localStorage.getItem('accent');

        if (savedTheme) {
            this.applyTheme(savedTheme);
        }

        if (savedAccent) {
            this.applyAccent(savedAccent);
        }
    }
}