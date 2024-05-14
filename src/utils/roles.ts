import { Response, Request, NextFunction } from "express";

const ROLES = {
    Admin: 'Admin',
    User: 'User',
    API_CONSUMER: 'API Consumer'
}

export { ROLES }

export const checkIsInRole = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(404).send('Not found')
    }

    const hasRole = roles.find(role => req.user.role === role)
    if (!hasRole) {
        return res.status(405).send('Not Allowed')
    }

    return next()
}