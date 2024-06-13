import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new pinataSDK({ pinataJWTKey: process.env.PIN_JWT });

export async function POST(req: Request) {
    try {
        const base64Image = await req.text();

        // Decode base64 to binary string
        const binaryString = atob(base64Image.split(',')[1]);

        // Convert the decoded string to a Uint8Array
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Create a Readable stream from the Uint8Array
        const readable = new Readable();
        readable._read = () => {}; // _read is required but you can noop it
        readable.push(Buffer.from(bytes));
        readable.push(null);

    

        // Pin the file to IPFS
        const result = await pinata.pinFileToIPFS(readable, {
          pinataMetadata: {
              name: 'image.jpg',
          },
          pinataOptions: {
              cidVersion: 1,
          },
      });

        return new Response(result.IpfsHash);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
