import { Injectable } from '@nestjs/common';
import * as crypto from "crypto"
import 'dotenv/config';
const key = (process.env.KEY!);

@Injectable()
export class CryptoService {
    generateSalt() {
        return crypto.randomBytes(16).toString('hex');
    }
    
    // Función para hashear una contraseña con PBKDF2
    hashPassword(password:string):Promise<string> {
        const salt = this.generateSalt();
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
            if (err) return reject(err);
            return resolve(salt + ':' + derivedKey.toString('hex'));
            });
        });
    }
    
    // Función para verificar una contraseña contra un hash almacenado
    comparePassword(password:string, storedHash:string):Promise<boolean> {
        const [salt, hash] = storedHash.split(':');
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
                if (err) return reject(err);
                return resolve(derivedKey.toString('hex') === hash);
            });
        });
    }
    
    // Función para cifrar datos con AES-128
    encryptData(data:string):string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let encryptedData = cipher.update(data, 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        return iv.toString('hex') + ':' + encryptedData;
    }
    
    // Función para descifrar datos cifrados con AES-128
     decryptData(encryptedData:string):string {
        const [iv, encryptedDataPart] = encryptedData.split(':');  
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, Buffer.from(iv, 'hex'))
        let decryptedData = decipher.update(encryptedDataPart, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');
        return decryptedData;
    }

}