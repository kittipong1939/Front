import useAuth from "./hooks/useAuth";
import AppRouter from "./routes/AppRouter";
import HomeUser from "./layout/Home/UserHome";
import AllProduct from "./layout/Product/ProductAll";
function App() {
  const {loading} = useAuth()

  if(loading) {
    return (
      <p className="text-4xl text-primary">Loading..</p>
    )
  }

  return (
    <div className="min-h-screen">
      <AppRouter />
 
     
      
      
    </div>
  );
}

export default App;