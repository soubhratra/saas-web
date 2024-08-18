import Header from '@/app/(auth)/header';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div >
      <div className="my-0.5 max-w-[475px] mx-auto">
        <Header/>
        {children}
      </div>
    </div>
  );
}