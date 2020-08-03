import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { LoadingService } from '../../services/loading.service';
import { ImgurReponse, ImgurError } from '../models/imgur-response';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @Output() imageLink: EventEmitter<string> = new EventEmitter();

  acceptedFiles: string[] = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.apng',
    '.tiff',
    '.tif',
    '.bmp',
    '.xcf',
    '.webp',
    '.mp4',
    '.mov',
    '.avi',
    '.webm',
    '.mpeg',
    '.flv',
    '.mkv',
    '.mpv',
    '.wmv',
  ];

  constructor(
    private uploadService: UploadService,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {}

  async upload(files: FileList) {
    if (files.length === 0) {
      return;
    }

    const data = new FormData();
    Array.from(files).forEach(file => {
      data.append('image', file);
    });

    try {
      this.loadingService.setUILoading();
      const result = await this.uploadService.upload(data);
      this.imageLink.emit(result.data.link);
      this.loadingService.setUILoading(false);
    } catch ({ error }) {
      const tempError = error as ImgurReponse<ImgurError>;
      this.snackbarService.showWarn(tempError.data.error.message);
    }
  }
}
