export function getAge(birthDate: string): { years: number; months: number } {
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months };
}
