export function logger(req, res, next) {
    // tslint:disable-next-line:no-console
    console.log('Request logged...');
    next();
}
