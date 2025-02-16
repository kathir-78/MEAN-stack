import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule} from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PostServiceService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { mimeType } from '../mime-type-validator';

@Component({
  selector: 'app-post-component',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatToolbarModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './post.component.component.html',
  styleUrl: './post.component.component.css'
})
export class PostComponentComponent implements OnInit {

 postId: string | null = null;
 post!: Post; 
 mode: string = "create";
 isLoading = false;
 form!: FormGroup;
 imagePreview: string | undefined;

  postService = inject(PostServiceService);
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]})
    })

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.isLoading = true;
        this.mode = "edit";
        this.postId = paramMap.get('postId');  
        if (this.postId) {
          this.postService.getPost(this.postId).subscribe({
            next: (response: any) => {
              const postData = response.onepost;
              this.isLoading = false;
              this.post = {
                id: postData._id, 
                title: postData.title,
                content: postData.content,
                imagePath: postData.imagePath,
                creater: postData.creater
              };
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath
              })
            },
            error: (error) => {
              console.error('Error fetching post:', error);
            }
          });
        }
      }
    });
  }

  onImagePicked(event: Event) {
    const file = ((event.target as HTMLInputElement).files?.[0]); // type conversion as for HTMLInputElement
     if(file) {
      this.form.patchValue({ image: file});
      this.form.get('image')?.updateValueAndValidity();
     }

     const reader = new FileReader(); 
     console.dir(reader);
     reader.onload = ()=> {
      this.imagePreview = reader.result as string;
     };
     if (file) {
      reader.readAsDataURL(file);
     }
  }

  onAddPost() {
    if(this.form.invalid) {
      return;
    }
    
    const title = this.form.value.title;
    const content = this.form.value.content;
    const image = this.form.value.image;
    
    if (this.mode === "edit" && this.postId) {
      this.postService.onUpdate(this.postId, title, content, image);
    } else {
      this.postService.addPost(title, content, image);
    }
    this.form.reset();
  }
}
