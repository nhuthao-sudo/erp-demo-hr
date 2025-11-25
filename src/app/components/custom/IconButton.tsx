import { Button } from "@/components/ui/button"; // Thêm import này
import { cn } from "@/lib/utils"; // Import cn để merge className

interface IconButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export const IconButton = ({ 
  icon, 
  text, 
  onClick, 
  variant = "default",
  size = "default",
  className,
  disabled = false
}: IconButtonProps) => {
  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={onClick} 
      disabled={disabled}
      className={cn("flex items-center gap-2", className)}
    >
      {icon}
      {text}
    </Button>
  );
};