import UserProvider from "./contexts/user"
import Router from "./Router"

function App() {

  return (
    <UserProvider>
      <Router />
    </UserProvider>
  )
}

export default App
