
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Package } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={28} />
            <h1 className="text-xl font-bold">ParcelTime</h1>
          </div>
          
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/">
                  <Button 
                    variant={isActive('/') ? "secondary" : "ghost"} 
                    className={isActive('/') ? "bg-white text-primary hover:bg-gray-100" : "text-white hover:bg-primary-foreground/10"}
                  >
                    Home
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/sender">
                  <Button 
                    variant={isActive('/sender') ? "secondary" : "ghost"} 
                    className={isActive('/sender') ? "bg-white text-primary hover:bg-gray-100" : "text-white hover:bg-primary-foreground/10"}
                  >
                    Send Parcel
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/receiver">
                  <Button 
                    variant={isActive('/receiver') ? "secondary" : "ghost"} 
                    className={isActive('/receiver') ? "bg-white text-primary hover:bg-gray-100" : "text-white hover:bg-primary-foreground/10"}
                  >
                    Receive Parcel
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/post-office">
                  <Button 
                    variant={isActive('/post-office') ? "secondary" : "ghost"} 
                    className={isActive('/post-office') ? "bg-white text-primary hover:bg-gray-100" : "text-white hover:bg-primary-foreground/10"}
                  >
                    Post Office
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
