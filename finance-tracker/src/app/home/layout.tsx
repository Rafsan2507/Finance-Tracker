
import MenubarComponent from "@/components/MenubarComponent/MenubarComponent";
import { ReduxProvider } from "@/redux/provider";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <MenubarComponent />
      {children}
    </ReduxProvider>
  );
}
