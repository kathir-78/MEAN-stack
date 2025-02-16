import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const  URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class PostServiceService {

  private posts:Post[] = [];
  private postSubject = new Subject<{posts:Post [], totalPosts: number}>();  // event Emitter
  private totalPosts = 0;

 
  
  constructor(private http: HttpClient, private route: Router) {}

  getPostUpdateListener() {
    return this.postSubject.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const newPost = new FormData();       // here we transfer formdata instead of json because it contains the file
    newPost.append('title', title);
    newPost.append('content', content);
    newPost.append('image', image);
    this.http.post<{message: String, post: Post}>(URL, newPost)
    .subscribe((addedPost)=> {
      this.route.navigate(['/']);
    })
  }

  getPosts(currtentPage: number, postsPerPage: number ) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currtentPage}`;
    this.http.get<{message: String, posts: any, totalPosts: number}>(URL+ queryParams)
    .pipe(map(postData => {
      this.totalPosts = postData.totalPosts;
      return  {
        posts: postData.posts.map((postarry: any): Post => {
        return {
          title: postarry.title,
          content: postarry.content,
          id: postarry._id,
          imagePath: postarry.imagePath,
          creater: postarry.creater
        };
      }),
      totalPosts: postData.totalPosts
    }
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.totalPosts = transformedPostData.totalPosts;
      this.postSubject.next({
        posts: [...this.posts],
        totalPosts: this.totalPosts});
    })
  }

  onUpdate(id: String, title: string, content: string, image: File | string) {
    
    let upDatePost: FormData | Post;

    if(typeof image === 'object') {             //when the form is created when the image is changed
      const formData = new FormData()
      formData.append('title', title),
      formData.append('content', content),
      formData.append('image', image)
      upDatePost = formData;
    }

    else {
      upDatePost = {                             // when the text is updated so used the JSON format
        id: id,
        title: title,
        content: content,
        imagePath: image as string,
        creater: localStorage.getItem('user_id') || ''
      }
    }

    this.http.put<{message: String}>(URL + id, upDatePost)
    .subscribe(() => {
      this.route.navigate(['/'])
    }, error => {
      console.error('Error updating post:', error);
      this.route.navigate(['/'])
    })
  }

  onDelete(_id: String) {
    return this.http.delete<{ message: String }>(URL + _id)
      .pipe(map(() => {
        // Update local posts array
        const updatedPosts = this.posts.filter(post => post.id !== _id);
        this.posts = updatedPosts;
        this.totalPosts--;
        this.postSubject.next({
          posts: [...this.posts],
          totalPosts: this.totalPosts
        });
      }));
  }

  getPost(id: string) {
    return this.http.get<{onepost:Post, message:String }>(URL + id);
  }

  getTotalPosts() {
    return this.totalPosts;
  }
}
