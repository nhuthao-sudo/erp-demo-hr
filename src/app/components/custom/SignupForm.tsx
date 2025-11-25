import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { useState } from "react";

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Xử lý đăng ký ở đây
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
        <CardDescription className="text-gray-500">
          Tạo tài khoản để bắt đầu sử dụng dịch vụ
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và tên */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Họ và tên
            </Label>
            <Input
              id="fullName"
              placeholder="Nhập họ và tên đầy đủ"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          {/* Mật khẩu */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Ít nhất 8 ký tự"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              minLength={8}
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Xác nhận mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
            />
          </div>

          {/* Điều khoản */}
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleChange("agreeToTerms", checked as boolean)}
              className="mt-1"
            />
            <div className="grid gap-1.5">
              <Label htmlFor="terms" className="text-sm font-normal leading-none cursor-pointer">
                Tôi đồng ý với{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  chính sách bảo mật
                </a>
              </Label>
            </div>
          </div>

          {/* Nút đăng ký */}
          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={!formData.agreeToTerms}
            size="lg"
          >
            Đăng ký
          </Button>
        </form>

        {/* Đăng nhập */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};