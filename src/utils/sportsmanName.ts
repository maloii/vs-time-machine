import { ISportsman } from '@/types/ISportsman';

export const sportsmanName = (sportsman: ISportsman, short: boolean = false): string => {
    if (!sportsman) return '';
    return `${sportsman.lastName || ''}${sportsman.firstName ? ` ${sportsman.firstName}` : ''} ${
        sportsman.middleName && !short ? ` ${sportsman.middleName}` : ''
    }${sportsman.nick ? ` (${sportsman.nick})` : ''}`;
};
