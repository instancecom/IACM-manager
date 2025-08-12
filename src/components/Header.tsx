import { Search, Bell, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-netflix-gray-dark">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-netflix-red tracking-tight">IACM</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button variant="ghost" className="text-foreground hover:text-netflix-red transition-colors font-medium">
              Início
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="ghost" className="text-muted-foreground hover:text-netflix-red transition-colors font-medium">
              Eventos
            </Button>
          </Link>
          <Link to="/visualizations">
            <Button variant="ghost" className="text-muted-foreground hover:text-netflix-red transition-colors font-medium">
              Visualizações
            </Button>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Desktop Icons */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hover:text-netflix-red transition-colors">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-netflix-red transition-colors">
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <Link to="/login" className="text-sm text-muted-foreground hidden lg:block hover:text-netflix-red transition-colors">
              Olá, Marcelo
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="hover:text-netflix-red transition-colors">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:text-netflix-red transition-colors">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-netflix-dark border-netflix-gray-dark">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-netflix-gray-dark">
                  <h2 className="text-lg font-semibold text-netflix-white">Menu</h2>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-4 py-6">
                  <Link 
                    to="/" 
                    onClick={() => setIsOpen(false)}
                    className="text-netflix-white hover:text-netflix-red transition-colors py-3 px-4 rounded-md hover:bg-netflix-gray-dark/50"
                  >
                    Início
                  </Link>
                  <Link 
                    to="/events" 
                    onClick={() => setIsOpen(false)}
                    className="text-netflix-gray-light hover:text-netflix-red transition-colors py-3 px-4 rounded-md hover:bg-netflix-gray-dark/50"
                  >
                    Eventos
                  </Link>
                  <Link 
                    to="/visualizations" 
                    onClick={() => setIsOpen(false)}
                    className="text-netflix-gray-light hover:text-netflix-red transition-colors py-3 px-4 rounded-md hover:bg-netflix-gray-dark/50"
                  >
                    Visualizações
                  </Link>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="text-netflix-gray-light hover:text-netflix-red transition-colors py-3 px-4 rounded-md hover:bg-netflix-gray-dark/50"
                  >
                    Admin
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="text-netflix-gray-light hover:text-netflix-red transition-colors py-3 px-4 rounded-md hover:bg-netflix-gray-dark/50"
                  >
                    Perfil
                  </Link>
                </nav>

                {/* Mobile Actions */}
                <div className="flex flex-col space-y-4 mt-auto pt-6 border-t border-netflix-gray-dark">
                  <Button 
                    variant="ghost" 
                    className="justify-start text-netflix-gray-light hover:text-netflix-red hover:bg-netflix-gray-dark/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Search className="h-5 w-5 mr-3" />
                    Buscar
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-netflix-gray-light hover:text-netflix-red hover:bg-netflix-gray-dark/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    Notificações
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;