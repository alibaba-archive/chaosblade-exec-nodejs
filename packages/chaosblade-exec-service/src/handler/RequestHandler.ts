import { Request, Response } from 'chaosblade-exec-common';

export interface RequestHandler {
  getHandlerName(): string;
  handle(paramRequest: Request): Response;
  unload();
}