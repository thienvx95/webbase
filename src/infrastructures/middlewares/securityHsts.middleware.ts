import { Request, Response, NextFunction } from "express";
import * as helmet from "helmet";
import { injectable } from "inversify";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@injectable()
@Middleware({ type: "before" })
export class SecurityHstsMiddleware implements ExpressMiddlewareInterface {
    public use(req: Request, res: Response, next: NextFunction): any {
        return helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
        })(req, res, next);
    }

}