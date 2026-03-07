import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UploadData } from './pages/upload-data/upload-data';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'upload', component: UploadData },
];
