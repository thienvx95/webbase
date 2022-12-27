import * as compression from "compression";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@Service()
@Middleware({ type: "before" })
export class CompressionMiddleware implements ExpressMiddlewareInterface {
    public use(req: Request, res: Response, next: NextFunction): any {
        return compression()(req, res, next);
    }

}