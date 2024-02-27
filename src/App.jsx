import useAuth from "./hooks/useAuth";
import AppRouter from "./routes/AppRouter";
import HomeUser from "./layout/Home/UserHome";
import AllProduct from "./layout/Product/ProductAll";
import Footer from './layout/Footer/Footer';
function App() {
  const {loading} = useAuth()

  if(loading) {
    return (
      <p className="text-4xl text-primary">Loading..</p>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white duration-200 ">
      <AppRouter /><br /><br /><br /><br /><br /><br /><br />
      <Footer />
     
      
      
    </div>
  );
}

export default App;