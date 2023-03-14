import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Calculator from "./pages/Calculator";
import Header from "./components/Header";
import IndexPosts from "./pages/IndexPosts";
import NewPost from "./pages/NewPost";
import MyPage from "./pages/MyPage";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Footer from "./components/Footer";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001/api/v1";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-blue-100 ...">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="light"
        />
        <BrowserRouter>
          <AuthContextProvider>
            <Header />
            <Routes>
              <Route exact path={`/`} element={<Calculator />} />
              <Route exact path={`/posts/new/`} element={<NewPost />} />
              <Route exact path={`/posts/`} element={<IndexPosts />} />
              <Route exact path={`/terms/`} element={<Terms />} />
              <Route
                exact
                path={`/privacy-policy/`}
                element={<PrivacyPolicy />}
              />
              <Route exact path={`/mypage/`} element={<MyPage />} />
            </Routes>
            <Footer />
          </AuthContextProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
