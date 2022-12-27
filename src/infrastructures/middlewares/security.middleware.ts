import { Request, Response, NextFunction } from "express";
import * as helmet from "helmet";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";

@Service()
@Middleware({ type: "before" })
export class SecurityMiddleware implements ExpressMiddlewareInterface {
    public use(req: Request, res: Response, next: NextFunction): any {
        return helmet.default()(req, res, next);
    }

}