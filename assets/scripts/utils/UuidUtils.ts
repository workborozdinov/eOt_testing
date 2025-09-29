class ByteHexMappings {
    byteToHex: string[] = [];
    hexToByte: { [hex: string]: number; } = {};

    constructor() {
        for (let i = 0; i < 256; i++) {
            this.byteToHex[i] = (i + 0x100).toString(16).substr(1);
            this.hexToByte[this.byteToHex[i]] = i;
        }
    }
}

const byteHexMappings = new ByteHexMappings();

export class UuidUtils {
    static getRandomFromMathRandom() {
        const result = new Array(16);
    
        let r = 0;
        for (let i = 0; i < 16; i++) {
            if ((i & 0x03) === 0) {
                r = Math.random() * 0x100000000;
            }
            result[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
    
        return result;
    }
    
    static getUuidV4() {
        const result = UuidUtils.getRandomFromMathRandom();
    
        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
        result[6] = (result[6] & 0x0f) | 0x40;
        result[8] = (result[8] & 0x3f) | 0x80;
    
        return result;
    }
    
    static uuidToString(buf: ArrayLike<number>, offset: number = 0) {
        let i = offset;
        const bth = byteHexMappings.byteToHex;
        return  bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]] + "-" +
                bth[buf[i++]] + bth[buf[i++]] + "-" +
                bth[buf[i++]] + bth[buf[i++]] + "-" +
                bth[buf[i++]] + bth[buf[i++]] + "-" +
                bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]];
    }

    static uuidToHexString(uuid: string): string {
        return uuid.replace(/-/g, '');
    }
    
    static hexStringToUuid(hex: string): string {
        const paddedHex = hex.padStart(32, '0');
        const uuid = [
            paddedHex.slice(0, 8),
            paddedHex.slice(8, 12),
            paddedHex.slice(12, 16),
            paddedHex.slice(16, 20),
            paddedHex.slice(20)
        ].join('-');
        return uuid;
    }
    
    static addOffsetToUuid(uuid: string, offset: number): string {
        const hexString = this.uuidToHexString(uuid);
        const intValue = BigInt('0x' + hexString);
        const newValue = intValue + BigInt(offset);
        return this.hexStringToUuid(newValue.toString(16));
    }
    
    static readonly generate = () => UuidUtils.uuidToString(UuidUtils.getUuidV4());
}