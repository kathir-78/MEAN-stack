import { Component, inject, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../posts/auth.service';

@Component({
  selector: 'app-header-post-component',
  imports: [MatToolbarModule, RouterLink, MatButtonModule, RouterLinkActive],
  templateUrl: './header-post-component.component.html',
  styleUrl: './header-post-component.component.css'
})

export class HeaderPostComponentComponent implements OnInit {
  
  userathenticatedIs = false;
  authService = inject(AuthService);

  ngOnInit() {
    this.userathenticatedIs = this.authService.getIsAuthenticate();
      this.authService.userAuthenticatedListener()
      .subscribe((userAthenticated)=> {
        this.userathenticatedIs = userAthenticated;
      })
  }

  onlogout() {
    this.authService.logout();
  }

}
