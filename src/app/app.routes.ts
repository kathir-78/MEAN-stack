import { Routes } from '@angular/router';
import { PostComponentComponent } from './posts/post.component/post.component.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './posts/auth.guard';

export const routes: Routes = [ 
    {
        path:'',
        pathMatch: 'full',
        component: PostListComponent
    },

    {
        path: 'create',
        component: PostComponentComponent,
        canActivate: [authGuard]
    },
    
    {
        path: 'edit/:postId',
        component: PostComponentComponent,
        canActivate: [authGuard]
    }
    ,
    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'signup',
        component: SignupComponent
    }
];
