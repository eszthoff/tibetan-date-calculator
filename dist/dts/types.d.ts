import { YEAR_ANIMALS, YEAR_ELEMENTS, YEAR_GENDER } from './constants';
export declare type Year = {
    tibYear: number;
    westernYear: number;
    rabjungCycle: number;
    rabjungYear: number;
    animal?: typeof YEAR_ANIMALS[number];
    element?: typeof YEAR_ELEMENTS[number];
    gender?: typeof YEAR_GENDER[number];
};
export declare type Month = {
    year: number;
    month: number;
    isLeapMonth: boolean;
    isDoubledMonth?: boolean;
    startDate?: string;
    endDate?: string;
};
export declare type Day = {
    year: number;
    month: {
        month: number;
        isLeapMonth: boolean;
        isDoubledMonth: boolean;
    };
    day: number;
    skippedDay: boolean;
    isPreviousSkipped: boolean;
    isLeapDay: boolean;
    isDoubledDay: boolean;
    westernDate: string;
};
