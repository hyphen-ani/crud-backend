import crypto from "crypto";

const SECRET = "sdofbADBGOIBET3h-95h-3i";

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}