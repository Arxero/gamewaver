import { Component, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { LoadingService } from '../services/loading.service';
import { SnackbarService } from '../services/snackbar.service';
import { ImgurReponse, ImgurError } from '../home/models/imgur-response';

@Component({
  selector: 'gw-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  @Output() imageLink: EventEmitter<string> = new EventEmitter();

  acceptedFiles: string[] = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
  ];

  constructor(
    private uploadService: UploadService,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
  ) {}

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
