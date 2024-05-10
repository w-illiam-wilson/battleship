import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { createDecipheriv } from 'crypto';

const iv = Buffer.from([183, 148, 241, 217, 108, 17,
    120,  41, 130,   1,   3, 20,
    152, 198,  96, 223]);
const password = 'BATTLESHIP IS COOL';

export async function encrypt(text: string): Promise<string> {
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([
      cipher.update(text),
      cipher.final(),
    ]);
    const json = JSON.stringify(encryptedText.toJSON())
    return json;
}

export async function decrypt(encryptedText: string): Promise<string> {
    const buffer = Buffer.from(JSON.parse(encryptedText).data);

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const decryptedText = Buffer.concat([
        decipher.update(buffer),
        decipher.final(),
    ]);
    return decryptedText.toString();
}