
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Package, Mail, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Map role to readable format
  const getRoleLabel = () => {
    switch(user?.role) {
      case 'sender': return 'Sender';
      case 'receiver': return 'Receiver';
      case 'post-office': return 'Post Office Staff';
      default: return '';
    }
  };
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-white rounded-full p-1.5">
              <Mail size={24} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold">ParcelTime</h1>
          </div>
          
          <div className="flex items-center">
            {user && (
              <>
                <nav className="mr-4">
                  <ul className="flex space-x-4">
                    {user.role === 'sender' && (
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
                    )}
                    
                    {user.role === 'receiver' && (
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
                    )}
                    
                    {user.role === 'post-office' && (
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
                    )}
                  </ul>
                </nav>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center mr-2">
                    <User className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      {user.name} <span className="text-xs opacity-80">({getRoleLabel()})</span>
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="text-white hover:bg-primary-foreground/10"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
