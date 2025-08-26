import { PlaitElement, Viewport } from '@plait/core';

export interface DrawnixExportedData {
  type: DrawnixExportedType.boardnow;
  version: number;
  source: 'web';
  elements: PlaitElement[];
  viewport: Viewport;
}

export enum DrawnixExportedType {
    boardnow = 'boardnow'
}