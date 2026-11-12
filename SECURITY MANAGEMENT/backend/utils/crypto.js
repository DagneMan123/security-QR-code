import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.QR_SECRET || process.env.JWT_SECRET || "default_qr_secret_key_12345";
const ALGO = "aes-128-cbc";

const KEY = crypto.createHash("sha256").update(SECRET_KEY).digest().slice(0, 16);

export function encrypt(text) {
    const iv = crypto.randomBytes(16); // AES block size
    const cipher = crypto.createCipheriv(ALGO, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    // return iv + encrypted, separated by ":"
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(data) {
    const [ivHex, encryptedHex] = data.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString("utf8");
}
