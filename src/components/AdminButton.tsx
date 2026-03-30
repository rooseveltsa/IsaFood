
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/admin')}
      variant="ghost"
      className="text-gray-500 hover:text-green-400 transition-colors text-sm"
    >
      <Shield className="h-4 w-4 mr-1" />
      Admin
    </Button>
  );
};
