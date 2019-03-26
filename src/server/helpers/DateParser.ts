import { isDate } from 'lodash';

export function parseDate(date: string, hour: string): Date {
    try {
        const dateParts = date.split('/');
        if (dateParts.length < 3) {
            return undefined;
        }

        const parsedDate = new Date(Date.parse(dateParts.reverse().join('-') + 'T' + hour + ':00:00.000Z'));
        return isDate(parsedDate) && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
    } catch (err) {
        console.error(err);
        return undefined;
    }
}