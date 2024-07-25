import { NavBar } from "./settings/_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-sky-500 gap-y-4">
      <NavBar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
