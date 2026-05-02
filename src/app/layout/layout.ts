import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { AuthService } from '@/auth/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Sidebar, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout implements OnInit {
  private _authService = inject(AuthService);

  isCollapsed = false;

  ngOnInit(): void {
    this._authService.getUserRoleOperations().subscribe();
  }
}
