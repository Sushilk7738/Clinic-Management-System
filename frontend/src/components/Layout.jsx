import Navbar from './Navbar';

const Layout = ({children})=>{
    return(
        <div className='min-h-screen bg-slate-100'>
            <Navbar/>
            <main className='p-4 sm:p-6'>
                {children}
            </main>
        </div>
    )
}

export default Layout;