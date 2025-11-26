export function validateTC(tcno: string): boolean {
    if (!tcno || tcno.length !== 11) return false;
    if (!/^[0-9]+$/.test(tcno)) return false;
    if (tcno[0] === '0') return false;

    const digits = tcno.split('').map(Number);

    // 1, 3, 5, 7, 9. hanelerin toplamı
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    // 2, 4, 6, 8. hanelerin toplamı
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];

    // 10. hane kontrolü
    const digit10 = ((oddSum * 7) - evenSum) % 10;
    if (digit10 !== digits[9]) return false;

    // 11. hane kontrolü
    const totalSum = digits.slice(0, 10).reduce((acc, curr) => acc + curr, 0);
    if (totalSum % 10 !== digits[10]) return false;

    return true;
}
