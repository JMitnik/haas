import React from 'react';
import { format, formatDistance, differenceInCalendarDays } from 'date-fns';

interface CellProps {
    value: any;
}

export const WhenCell = ({ value }: { value: any }) => {
    const date = new Date(parseInt(value));
    const currentDate = new Date();
    const dateDifference = differenceInCalendarDays(currentDate, date);
    let formatted;
    if (dateDifference <= 4 || dateDifference >= 7) {
        formatted = `${formatDistance(date, currentDate)} ago`;
    } else if (dateDifference > 4 && dateDifference < 7) {
        formatted = format(date, 'EEEE hh:mm a')
    }

    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 'max-content', padding: '4px 24px', borderRadius: '90px', background: '#f1f5f8', color: '#6d767d' }}>
            <span style={{ fontSize: '0.8em', fontWeight: 900 }}>{formatted?.toUpperCase()}</span>
        </div>

    </div>
}

const getBadgeBackgroundColour = (value: number) => {
    if (value >= 70) return { background: '#e2f0c7', color: '#42c355' };
    else if (value > 50 && value < 70) return { background: '#f2dda5', color: '#dd992a' };
    else return { background: '#f5c4c0', color: '#d5372c' };
}

export const ScoreCell = ({ value }: CellProps) => {
    const { background, color } = getBadgeBackgroundColour(value);
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 'max-content', border: '1px solid', padding: '10px', borderRadius: '360px', background, color, borderColor: background }}>
                <span style={{ fontSize: '1.2em', fontWeight: 900 }}>{value}</span>
            </div>

        </div>
    )
}

export const UserCell = ({ value }: CellProps) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 'max-content', padding: '4px 24px', borderRadius: '90px', background: '#f1f5f8', color: '#6d767d' }}>
                <span style={{ fontSize: '0.8em', fontWeight: 900 }}>{value}</span>
            </div>

        </div>
    )
}

export const CenterCell = ({ value }: CellProps) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 'max-content' }}>
                <span style={{ fontSize: '1.2em', fontWeight: 900 }}>{value}</span>
            </div>

        </div>
    )
}