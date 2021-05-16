import { Component, Output, EventEmitter } from '@angular/core';
import { UploadService, LoadingService, SnackbarService } from '@gamewaver/services';
import { ImgurReponse, ImgurError, ImgurSuccess } from '@gamewaver/home';

@Component({
  selector: 'gw-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  @Output() imageLink: EventEmitter<string> = new EventEmitter();
  acceptedFiles: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

  constructor(
    private uploadService: UploadService,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
  ) {}

  async upload(files: FileList): Promise<void> {
    if (files.length === 0) {
      return;
    }

    const data = new FormData();
    Array.from(files).forEach(file => {
      data.append('image', file);
    });

    try {
      this.loadingService.setUILoading();
      const result = (await this.uploadService.upload(data)).data as ImgurSuccess;
      this.imageLink.emit(result.link);
    } catch ({ error }) {
      const errorData = (error as ImgurReponse<ImgurError>).data;

      if (typeof errorData.error === 'string') {
        this.snackbarService.showWarn(errorData.error);
        throw new Error(errorData.error);
      } else {
        this.snackbarService.showWarn(errorData.error.message);
        throw new Error(errorData.error.message);
      }
    } finally {
      this.loadingService.setUILoading(false);
    }
  }
}
