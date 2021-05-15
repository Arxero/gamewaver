import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { EmojiEvent, EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  ConnectionPositionPair,
  CdkOverlayOrigin,
} from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';

@Component({
  selector: 'gw-emoji',
  templateUrl: './emoji.component.html',
})
export class EmojiComponent {
  @Output() emoji: EventEmitter<EmojiData> = new EventEmitter();
  private overlayRef: OverlayRef;
  @ViewChild('overlayTemplate') overlayTemplate: CdkPortal;

  constructor(private overlay: Overlay) {}

  addEmoji(ev: EmojiEvent) {
    this.emoji.emit(ev.emoji);
    this.overlayRef.dispose();
  }

  openEmojiOverlay(origin: CdkOverlayOrigin) {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin.elementRef)
      .withPositions(this.getPositions())
      .withFlexibleDimensions(true)
      .withPush(true)
      .withLockedPosition(true)
      .withViewportMargin(200);

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      backdropClass: 'backdrop',
      hasBackdrop: true,
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.dispose();
    });

    this.overlayRef.attach(this.overlayTemplate);
  }

  private getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      },
    ];
  }
}
