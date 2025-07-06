import React, {useState} from "react";
import "./search-form.scss";
import ResortsSelect from "./resorts-select/resorts-select";
import GuestsSelect from "./guests-select/guests-select";
import SearchButton from "./search-button/search-button";
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';

interface SearchFormProps {
    onSearch: (searchParams: {
        ski_site: number;
        from_date: string;
        to_date: string;
        group_size: number;
    }) => void;
    isLoading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading = false }) => {
    const [skiSiteId, setSkiSiteId] = useState<number>(1);
    const [groupSize, setGroupSize] = useState<number>(1);
    const [checkInDate, setCheckInDate] = useState<Date | null>(dayjs().add(1, 'day').toDate());
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(dayjs().add(8, 'days').toDate());

    const handleSearch = () => {
        if (!checkInDate || !checkOutDate) return;
        
        // Ensure check-out date is after check-in date
        if (dayjs(checkOutDate).isBefore(dayjs(checkInDate))) {
            alert('Check-out date must be after check-in date');
            return;
        }
        
        onSearch({
            ski_site: skiSiteId,
            from_date: dayjs(checkInDate).format('MM/DD/YYYY'),
            to_date: dayjs(checkOutDate).format('MM/DD/YYYY'),
            group_size: groupSize
        });
    };

    return (
        <div className="search-form">
            <ResortsSelect value={skiSiteId} onChange={skiSiteId => setSkiSiteId(skiSiteId)} />
            <GuestsSelect value={groupSize} onChange={groupSize => setGroupSize(groupSize)} />
            
            <DatePicker 
                className="search-form-date-picker" 
                selected={checkInDate} 
                onChange={(date) => setCheckInDate(date)} 
                enableTabLoop={false}
                placeholderText="Check-in Date"
                dateFormat="MM/dd/yyyy"
                minDate={new Date()}
            />
            <DatePicker 
                className="search-form-date-picker" 
                selected={checkOutDate} 
                onChange={(date) => setCheckOutDate(date)} 
                enableTabLoop={false}
                placeholderText="Check-out Date"
                dateFormat="MM/dd/yyyy"
                minDate={checkInDate || new Date()}
            />
            {checkInDate && checkOutDate && (
                <div className="nights-indicator">
                    {dayjs(checkOutDate).diff(dayjs(checkInDate), 'day')} nights
                </div>
            )}

            <SearchButton onClick={handleSearch} disabled={isLoading} />
        </div>
    );
}

export default SearchForm;