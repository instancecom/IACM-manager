import { Search, Bell, User, Menu, X, LogOut, LogIn, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { canEdit } = useRoles();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-netflix-gray-dark">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-xl sm:text-2xl font-extrabold text-netflix-red tracking-tight">IACM</h1>
          </Link>
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
          {user && (
            <Link to="/visualizations">
              <Button variant="ghost" className="text-muted-foreground hover:text-netflix-red transition-colors font-medium">
                Visualizações
              </Button>
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Desktop Auth/Profile Section */}
          <div className="hidden lg:flex items-center space-x-1">
            {user ? (
              <>
                {canEdit && (
                  <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/visualizations" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Dados
                  </Button>
                </Link>
                <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Perfil
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Button>
                </Link>
                <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Criar Conta
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:text-netflix-red transition-colors">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link 
                  to="/events" 
                  className="flex items-center gap-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Bell className="w-5 h-5" />
                  Eventos
                </Link>
                {user && (
                  <>
                    <Link 
                      to="/visualizations" 
                      className="flex items-center gap-2 text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <BarChart3 className="w-5 h-5" />
                      Consultar Dados
                    </Link>
                    {canEdit && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        Administração
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Perfil
                    </Link>
                  </>
                )}
                <hr className="my-4" />
                {user ? (
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-lg font-medium justify-start p-0 h-auto"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Sair
                  </Button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="flex items-center gap-2 text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      Entrar
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex items-center gap-2 text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Criar Conta
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;