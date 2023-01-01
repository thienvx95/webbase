import { Request, Response, NextFunction } from "express";
import * as helmet from "helmet";
import { injectable } from "inversify";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@injectable()
@Middleware({ type: "before" })
export class SecurityMiddleware implements ExpressMiddlewareInterface {
    public use(req: Request, res: Response, next: NextFunction): any {
        return helmet.default()(req, res, next);
    }

}