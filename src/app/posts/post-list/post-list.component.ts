import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import { Post } from '../../models/post.model';
import { PostServiceService } from '../post.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, MatButtonModule, RouterLink, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})


export class PostListComponent implements OnInit, OnDestroy {

  isLoading = false;
  posts:Post[] = [];  
  private postsSub!: Subscription;
  postsPerPage: number = 3;
  currentPage: number = 1;
  totalPosts: number = 0;
  private authSub!: Subscription

  userIsAuthenticated = false;
  userId= '';

  postService = inject(PostServiceService);
  authService = inject(AuthService)
  
  ngOnInit() { 
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.postsPerPage);
    this.postsSub = this.postService.getPostUpdateListener().
      subscribe((postData :{posts: Post [], totalPosts: number})=> {
        console.log('Received posts:', postData); 
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts
        this.isLoading = false;
      })

    this.userIsAuthenticated = this.authService.getIsAuthenticate();
    this.userId = this.authService.getUserId() ?? '';
    // this.authSub = this.authService.userAuthenticatedListener()
    //   .subscribe( isAuthenticated => {
    //   this.userIsAuthenticated = isAuthenticated
    // })
    
  }

  deletePost(id: String) {
    this.isLoading = true;
    console.log("clicked post delete");
    this.postService.onDelete(id).subscribe(() => {
      this.postService.getPosts(this.currentPage, this.postsPerPage);
    }, error => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
      this.postsSub.unsubscribe();
      // this.authSub.unsubscribe();
  }

  onClickedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage =  pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.currentPage, this.postsPerPage);
  }
}

 