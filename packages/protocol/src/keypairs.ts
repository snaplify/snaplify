import { generateKeyPair, exportSPKI, exportPKCS8 } from 'jose';

export interface ActorKeypair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

/** Generate an RSA 2048 keypair for HTTP Signatures */
export async function generateKeypair(): Promise<ActorKeypair> {
  const { publicKey, privateKey } = await generateKeyPair('RS256', {
    modulusLength: 2048,
    extractable: true,
  });
  return { publicKey, privateKey };
}

/** Export public key as SPKI PEM */
export async function exportPublicKeyPem(keypair: ActorKeypair): Promise<string> {
  return exportSPKI(keypair.publicKey);
}

/** Export private key as PKCS8 PEM */
export async function exportPrivateKeyPem(keypair: ActorKeypair): Promise<string> {
  return exportPKCS8(keypair.privateKey);
}

/** Build the Key ID URI for an actor's public key */
export function buildKeyId(domain: string, username: string): string {
  return `https://${domain}/users/${username}#main-key`;
}
