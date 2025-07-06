import React from "react";
import "./nav-bar.scss";
import WeSkiLogo from "../weski-logo/weski-logo";
import SearchForm from "../search-form/search-form";
import { SearchParams } from "../../services/api.service";

interface NavBarProps {
    onSearch: (searchParams: SearchParams) => void;
    isLoading?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ onSearch, isLoading = false }) => {
    return (
        <div className="nav-bar">
            <WeSkiLogo />
            <SearchForm onSearch={onSearch} isLoading={isLoading} />
        </div>
    );
}

export default NavBar;