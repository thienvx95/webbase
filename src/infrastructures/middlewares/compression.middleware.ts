import * as compression from "compression";
import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@injectable()
@Middleware({ type: "before" })
export class CompressionMiddleware implements ExpressMiddlewareInterface {
    public use(req: Request, res: Response, next: NextFunction): any {
        return compression()(req, res, next);
    }

}