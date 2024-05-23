import Header from '@/app/(auth)/header';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div >
      <Header/>
      <div className="my-0.5 max-w-[475px] mx-auto">
        {children}
      </div>
    </div>
  );
}