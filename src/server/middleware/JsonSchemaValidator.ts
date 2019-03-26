import * as AJV from 'ajv';
import { Request, Response, NextFunction } from 'express';
const ajv = new AJV();

export function validate(schema: Object) {
    const validate = ajv.compile(schema)

    return function(req: Request, res: Response, next: NextFunction) {
        if(validate(req.body)){
            return next();
        }

        next(validate.errors);
    }
}