import { Route, Routes, useParams } from "react-router-dom";
import { AuthProvider } from "./components/Context/AuthProvider";
import { ToastContainer, Slide } from 'react-toastify';
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import DiaryDetail from "./components/Diary/DiaryDetail";
import EntryDetail from "./components/Entry/EntryDetail";
import UserProfile from "./components/User/UserProfile";
import SearchResults from "./components/Search/SearchResults";
import CloseToastButton from "./components/Toast/CloseToastButton";
import ForgotPassword from "./components/PasswordRecovery/ForgotPassword";
import ResetPassword from "./components/PasswordRecovery/ResetPassword";
import VerifyEmailModal from "./components/Modals/VerifyEmailModal";
import './App.css'
import './components/Toast/ToastStyles.scss';
import 'react-toastify/dist/ReactToastify.min.css';

const VerifyEmailWrapper = () => {
  const { token } = useParams();
  return <VerifyEmailModal token={token} />;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/diary/:diaryId/*" element={<DiaryDetail />} />
          <Route path="/diary/:diaryId/entries/:entryId" element={<EntryDetail />} />
          <Route path="/user/:username" element={<UserProfile />} /> 
          <Route path="/search" element={<SearchResults />} /> 
          <Route path="/verify-email/:token" element={<VerifyEmailWrapper />} />
        </Routes>
        <ToastContainer 
          icon={false}
          transition={Slide}
          closeButton={CloseToastButton}
        />
      </div>
    </AuthProvider>
  )
}

export default App;
